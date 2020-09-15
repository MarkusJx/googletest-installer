cmake_minimum_required(VERSION 3.12)
project(test CXX)

set(CMAKE_CXX_STANDARD 20)

if (WIN32)
    option(GTEST_INCLUDE "")
    option(GTEST_LINK "")

    link_directories("D:/gtest/lib")
    include_directories("D:/gtest/include")

    set(CMAKE_CXX_FLAGS_RELEASE "/MT")
    set(CMAKE_CXX_FLAGS_DEBUG "/MTd")
endif ()

if (APPLE)
    link_directories("/usr/local/lib")
    include_directories("/usr/local/include")
endif ()

add_executable(test test.cpp)

if (WIN32)
    target_link_libraries(${PROJECT_NAME} PRIVATE gtest_main gtest)
else ()
    target_link_libraries(${PROJECT_NAME} PRIVATE gtest pthread)
endif ()
