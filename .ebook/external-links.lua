local function chapter_key(path)
  path = path:gsub("^%./", "")
  while path:match("^%.%./") do
    path = path:gsub("^%.%./", "", 1)
  end
  return path:gsub("/", "__"):lower()
end

function Pandoc(document)
  local chapters = {}
  local headers = {}

  for _, block in ipairs(document.blocks) do
    if block.t == "Header" then
      headers[block.identifier:lower()] = block.identifier
    end
    if block.t == "Header" and block.level == 1 then
      local source = block.identifier:match("^(.-md)__")
      if source then
        source = source:lower()
        chapters[source] = chapters[source] or block.identifier
        chapters[source:gsub("[^%w]", "")] =
          chapters[source:gsub("[^%w]", "")] or block.identifier
        local basename = source:match("([^_]+%.md)$")
        if basename then
          chapters[basename] = chapters[basename] or block.identifier
          chapters[basename:gsub("[^%w]", "")] =
            chapters[basename:gsub("[^%w]", "")] or block.identifier
        end
      end
    end
  end

  return document:walk({
    Link = function(link)
      local target = link.target
      if target:match("^#") then
        local key = target:match("^#(.+)$")
        if key and chapters[key:lower()] then
          link.target = "#" .. chapters[key:lower()]
        end
        return link
      end

      local path, fragment = target:match("^([^#]+)#?(.*)$")
      if path and path:match("%.md$") then
        local key = chapter_key(path)
        local basename = path:match("([^/]+%.md)$")
        local anchor = chapters[key]
        if not anchor and basename then
          anchor = chapters[basename:lower()]
        end
        if fragment ~= "" then
          local scoped = key .. "__" .. fragment:lower()
          anchor = headers[scoped]
          if not anchor and basename then
            scoped = basename:lower() .. "__" .. fragment:lower()
            anchor = headers[scoped]
          end
        end
        if anchor then
          link.target = "#" .. anchor
          return link
        end
      end

      return link.content
    end
  })
end
