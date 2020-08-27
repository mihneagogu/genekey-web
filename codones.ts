// 'var' necessary to get around annoying and weird error 'codeJson identifier defined twice' ?????
var codoneJson = [{"index":0,"keys":[1,2,3],"name":"Codone 0","description":"I am the 0th codone"}];
var codone0: CodoneRing = CodoneRing.fromJson(codoneJson[0]);

var codoneLibrary: CodoneRing[] = [codone0];

for (let i = 1; i <= GKConstants.MaxCodone; i++) {
    codoneLibrary.push(codone0.deepCloneId(i));
}
