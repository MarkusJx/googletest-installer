# googletest-installer

Install gtest on gh actions

## Usage
action.yml:
```yml
- name: Install googletest
  uses: MarkusJx/googletest-installer@v0.0.1
  id: install_gtest
# On windows, the path to the gtest libs will be set to steps.install_gtest.outputs.library_dir
# On windows, the path to the gtest include directory
# will be set to steps.install_gtest.outputs.include_dir
# On any other os, the libraries and include files will be "installed"
```