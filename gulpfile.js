const { series } = require("gulp");
const execa = require("execa");
// print output of commands into the terminal
const stdio = "inherit";
const argv = require("yargs").help(false).argv

// Order sensitive
const packages = [
    { name: "language-diagrams-protocol"},
    { name: "language-diagrams-langium"},
    { name: "language-diagrams-server"},
    { name: "language-diagrams-webview"},
    { name: "language-diagrams-vscode"},
]

async function execInProject(project, task) {
    try {
        console.log("Running for: " + project)
        await execa("yarn", ["workspace", project, "run", task],{
            stdio,
        });
    } catch (e) {
        console.error(e)
    }
    
}

async function testAll() {
    if (argv.coverage) {
        await execa("yarn", ["exec", "jest","--ci", "--json", "--coverage", "--testLocationInResults", "--outputFile=report.json"], {
          stdio,
        })
      } else {
        await execa("yarn", ["exec", "jest"], {
          stdio,
        })
      }
}

const build = series(packages.map(it => async function() {
    await execInProject(it.name, "build");
}))

const prepare = series(packages.map(it => async function() {
    await execInProject(it.name, "prepare");
}))

const clean = series(packages.map(it => async function() {
    await execInProject(it.name, "clean")
}))

const depcheck = series(packages.map(it => async function() {
    await execInProject(it.name, "depcheck")
}))

const help = async () => {
    await execa("gulp", ["-T", "--depth", "1"], { stdio })
}

const test = series(build, testAll)

const test_nobuild = series(packages.map(it => async function() {
    await execInProject(it.name, "test")
}))

exports.build = build;
exports.build.description = "Build all packages.";

exports.clean = clean
exports.clean.description = "Cleans all the build files"

exports.prepare = prepare
exports.prepare.description = "Cleans, builds and lints all packages"

exports.depcheck = depcheck
exports.depcheck.description = "Check package dependancies"

exports.test = test
exports.test.description = "Run all tests in the repository."
exports.test.flags = {
  "--coverage": "Collect coverage information during the test run.",
}

exports.test_nobuild = test_nobuild
exports.test_nobuild.description = "Run all tests in the repository without building first."

exports.help = help