const core = require('@actions/core');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function clone() {
    console.log("Downloading googletest...");

    let git;
    if (process.platform === "win32") {
        git = spawn('cmd', ['/c', 'git', 'clone', 'https://github.com/google/googletest']);
    } else {
        git = spawn('git', ['clone', 'https://github.com/google/googletest']);
    }

    git.stdout.pipe(process.stdout);
    git.stderr.pipe(process.stdout);
    git.on('close', code => {
        if (code == 0) {
            try {
                configure();
            } catch (error) {
                core.setFailed(error.message);
            }
        } else {
            core.setFailed(`Git clone exited with exit code ${code}`);
        }
    });
}

function configure() {
    console.log("\nConfiguring googletest...");

    let cmake;
    if (process.platform === "win32") {
        cmake = spawn('cmd', ['/c', 'cmake', '.', '-B', 'build'], { cwd: 'googletest' });
    } else {
        cmake = spawn('cmake', ['-DCMAKE_BUILD_TYPE=Release', '.', '-B', 'build'], { cwd: 'googletest' });
    }

    cmake.stdout.pipe(process.stdout);
    cmake.stderr.pipe(process.stdout);
    cmake.on('close', code => {
        if (code == 0) {
            try {
                build();
            } catch (error) {
                core.setFailed(error.message);
            }
        } else {
            core.setFailed(`cmake configure exited with exit code ${code}`);
        }
    });
}

function build() {
    console.log("\nBuilding googletest...");

    let cmake;
    if (process.platform === "win32") {
        cmake = spawn('cmd', ['/c', 'cmake', '--build', '.', '--config', 'Release'], { cwd: 'googletest/build' });
    } else {
        cmake = spawn('cmake', ['--build', '.'], { cwd: 'googletest/build' });
    }

    cmake.stdout.pipe(process.stdout);
    cmake.stderr.pipe(process.stdout);
    cmake.on('close', code => {
        if (code == 0) {
            try {
                install();
            } catch (error) {
                core.setFailed(error.message);
            }
        } else {
            core.setFailed(`cmake build exited with exit code ${code}`);
        }
    });
}

function install() {
    if (process.platform === "linux") {
        console.log("\nInstalling googletest...");
        spawnSync('sudo cp googletest/build/lib/libgtest.a /usr/lib/libgtest.a');
        spawnSync('sudo cp googletest/build/lib/libgtest_main.a /usr/lib/libgtest_main.a');
        spawnSync('sudo ln -s /usr/lib/libgtest.a /usr/local/lib/libgtest.a');
        spawnSync('sudo ln -s /usr/lib/libgtest_main.a /usr/local/lib/libgtest_main.a');

        spawnSync('sudo cp -R googletest/googletest/include/gtest /usr/include');
    } else if (process.platform === "darwin") {
        console.log("\nInstalling googletest...");
        spawnSync('sudo cp googletest/build/lib/libgtest.a /opt/local/lib/libgtest.a');
        spawnSync('sudo cp googletest/build/lib/libgtest_main.a /opt/local/lib/libgtest_main.a');.

        spawnSync('sudo cp -R googletest/googletest/include/gtest /opt/local/include');
    } else if (process.platform === "win32") {
        console.log("\nRunning on windows, not installing googletest, the library path will be set to library_dir, the include path will be set to include_dir");
        core.setOutput("library_dir", path.join(__dirname, "googletest/build/lib/Release"));
        core.setOutput("include_dir", path.join(__dirname, "googletest/googletest/include"));
    } else {
        core.setFailed("Unsupported platform");
    }

    console.log("Done.");
}

try {
    clone();
} catch (error) {
    core.setFailed(error.message);
}