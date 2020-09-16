# googletest-installer

Install gtest on gh actions

## Usage
action.yml:
```yml
- name: Install gtest
  uses: MarkusJx/googletest-installer@v1.0
```

#### On linux
* The libraries will be located in ``/usr/lib``
* The headers to include will be located in ``/usr/include``

#### On windows
* The libraries will be located in ``D:/gtest/lib``
* The headers to include will be located in ``D:/gtest/include``

#### On macOs
* The libraries will be located in ``/usr/local/lib``
* The headers to include will be located in ``/usr/local/include``

To set the correct paths, you could add to your ``CMakeLists.txt``:
```Cmake
if (DEFINED ENV{GITHUB_ACTIONS})
  if (WIN32)
    link_directories("D:/gtest/lib")
    include_directories("D:/gtest/include")

    set(CMAKE_CXX_FLAGS_RELEASE "/MT")
    set(CMAKE_CXX_FLAGS_DEBUG "/MTd")
  elseif (APPLE)
    link_directories("/usr/local/lib")
    include_directories("/usr/local/include")
  endif ()
endif ()
```
