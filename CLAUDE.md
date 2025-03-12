# MaiMBot-docs Guide

## Build Commands
- Build HTML: `make html` or `python -m sphinx -b html source build/html`
- Build single file: `python -m sphinx -b html source/specific_file.rst build/html`
- Clean build: `make clean`
- Check links: `make linkcheck`
- View available commands: `make help`

## Style Guidelines
- **reStructuredText**: Follow standard reST syntax conventions
- **Language**: Content primarily in Simplified Chinese (zh_CN)
- **File Structure**: 
  - Place all documentation source in the `source/` directory
  - Use lowercase filenames with hyphens for separation
  - Include appropriate file extensions (.rst)
- **Content Organization**:
  - Maintain logical hierarchy in the toctree directives
  - Use appropriate heading levels (=, -, ~, ^)
  - Keep line length reasonable (80-100 characters)
- **Code Blocks**: Use appropriate syntax highlighting with .. code-block:: directives
- **Images**: Store in source/_static directory and reference with relative paths