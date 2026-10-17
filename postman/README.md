# Testes no Postman

Importe os arquivos `API NodeJS.postman_collection.json` e `API NodeJS.postman_environment.json` no Postman. Selecione o ambiente **API NodeJS - Local**, inicie a API e execute as requisições organizadas por recurso.

As requisições `CREATE` armazenam os IDs dos registros temporários no environment. Assim, `VIEW`, `EDIT` e `DELETE` trabalham sobre o mesmo registro criado durante o teste. Os IDs iniciados por `seed` e o `userSituationId` representam apenas os relacionamentos cadastrados pelas seeds e podem ser ajustados se o banco utilizar outros IDs.

O environment contém somente a URL local e IDs de teste, sem credenciais.
