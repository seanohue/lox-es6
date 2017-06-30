const fs = require('fs')

class ASTWriter {
  static generateAST () {
    const expressionsDir = `${__dirname}/expressions`
    ASTWriter.defineAST(expressionsDir, 'Expr', [
      'Binary   : left, operator, right',
      'Grouping : expression',
      'Literal  : value',
      'Unary    : operator, right'
    ])
    console.log(`AST generated in ${expressionsDir}.`)
  }

  static defineAST (outputDir, baseName, types = []) {
    const path = `${outputDir}/${baseName}.js`
    ASTWriter.writeExprClass(path, baseName)

    for (const typeDef of types) {
      ASTWriter.writeExprClass(path, baseName, typeDef)
    }
  }

  static writeExprClass (path, baseName, typeDef) {
    const {className, argList} = typeDef
      ? ASTWriter.parseTypeDef(typeDef)
      : { className: baseName }
    fs.writeFileSync(path,
// Template for code generation:
`
${typeDef ? 'const Expr = require(\'./Expr\')' : ''}

class ${typeDef ? `${className} extends ${baseName}` : baseName} {
  ${typeDef
    ? `constructor(${argList}) {
      ${argList
          .split(', ')
          .map(arg => `this.${arg} = ${arg}\n`)}
    }`
    : ''
  }
}

module.exports = ${className}
`)
// End template for code generation.
  }

  static parseTypeDef (typeDef) {
    console.log(typeDef)
    const [className, argList] = typeDef
      .split(':')
      .map(part => part.trim())
    return { className, argList }
  }
}

module.exports = ASTWriter
