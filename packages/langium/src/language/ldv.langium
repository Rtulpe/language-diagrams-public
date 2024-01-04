grammar Ldv

// Declaring specific types
interface ValidationFile {
    content: Statement[];
}

// Rules

entry Validation returns ValidationFile:
    (content+=Statement)*;

Ensure: 'ensure' condition=Expression 'otherwise' else=(StatementList);
When: 'when' condition=Expression ( (then=Statement) | (then=StatementList ('otherwise' else=StatementList )?));
ValidationError: 'validation' 'error' msg=STRING;
StatementList: '{' statements+=Statement* '}';

Statement: Ensure | When | ValidationError;

Expression:
    Logical;

Logical infers Expression:
    Equality (({infer And.left = current} '&&' | {infer Or.left=current} '||')  right=Equality)*;

Equality infers Expression:
    Comparison (({infer Equals.left = current} '==' | {infer NotEquals.left=current} '!=')  right=Comparison)*;

Comparison infers Expression:
    Additive (({infer GreaterThan.left = current} '>' | {infer LessThan.left=current} '<')  right=Additive)*;

Additive infers Expression:
    Multiplicative (({infer Addition.left = current} '+' | {infer Subtraction.left=current} '-')  right=Multiplicative)*;

Multiplicative infers Expression:
    DotExpression (({infer Multiplication.left = current} '*' | {infer Division.left=current} '/')  right=Primary)*;

DotExpression infers Expression:
    Primary ({infer DotExpression.base = current} '.' target=DotTarget)*;

Primary infers Expression:
    {infer Parenthesis} '(' expr=Expression ')' |
    NotExpression |
    NumberLiteral |
    BooleanLiteral |
    StringLiteral |
    RefExpression;

NotExpression infers Expression:
    {infer NotExpression}'not' '(' base=Expression ')';

// This is not exactly a reference, but serves the same purpose
RefExpression: Field | Association;

DotTarget:
    {infer DotTargetRef} ref=RefExpression;

NumberLiteral: value = NUMBER;
BooleanLiteral: value ?= 'true' | 'false';
StringLiteral: value = STRING;

Field: name=ID;
Association: '->' name=ID;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal NUMBER returns number: /[0-9]+(\.[0-9]+)?/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
