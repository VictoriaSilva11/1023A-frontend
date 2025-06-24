import mysql, { Connection, ConnectionOptions } from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import cors from '@fastify/cors'
const app = fastify()
app.register(cors)

app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send("Fastify Funcionando")
})
app.get('/produtos', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const conn =  await mysql.createConnection({
            host: "localhost",
            user: 'root',
            password: "",
            database: 'maison_victoria',
            port: 3306
        })
        const resultado =  await conn.query("SELECT id, nome, preco, categoria FROM produtos")
        const [dados, camposTabela] = resultado
        reply.status(200).send(dados)
    }
    catch (erro: any) {
        if (erro.code === 'ECONNREFUSED') {
            console.log("ERRO: LIGUE O LARAGAO => Conexão Recusada")
            reply.status(400).send({mensagem:"ERRO: LIGUE O LARAGAO => Conexão Recusada"})
        } else if (erro.code === 'ER_BAD_DB_ERROR') {
            console.log("ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO"})
        } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO")
            reply.status(400).send({mensagem:"ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO"})
        } else if (erro.code === 'ER_NO_SUCH_TABLE') {
            console.log("ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY")
            reply.status(400).send({mensagem:"ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY"})
        } else if (erro.code === 'ER_PARSE_ERROR') {
            console.log("ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS")
            reply.status(400).send({mensagem:"ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS"})
        } else {
            console.log(erro)
            reply.status(400).send({mensagem:"ERRO: NÃO IDENTIFICADO"})
        }
    }
})

app.post('/produtos', async (request: FastifyRequest, reply: FastifyReply) => {
    const {id, nome, preco, categoria} = request.body as any;

    try {
        const conn = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "maison_victoria",
            port: 3306
        });

        const query = "INSERT INTO produtos (id, nome, preco, categoria) VALUES (?, ?, ?, ?)";
        await conn.query(query, [id, nome, preco, categoria]);


        reply.status(200).send({ mensagem: "Item adicionado com sucesso ao carrinho!" });
    } catch (erro: any) {
        switch (erro.code) {
            case "ECONNREFUSED":
                console.log("ERRO: LIGUE O LARAGÃO!!! CABEÇA!");
                reply.status(400).send({ mensagem: "ERRO: LIGUE O LARAGÃO!!! CABEÇA!" });
                break;
            case "ER_BAD_DB_ERROR":
                console.log("ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O NOME DO BANCO DE DADOS OU CRIE UM NOVO BANCO COM O NOME QUE VOCÊ COLOCOU LÁ NA CONEXÃO" });
                break;
            case "ER_ACCESS_DENIED_ERROR":
                console.log("ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO");
                reply.status(400).send({ mensagem: "ERRO: CONFIRA O USUÁRIO E SENHA NA CONEXÃO" });
                break;
            default:
                console.log(erro);
                reply.status(400).send({ mensagem: "Erro desconhecido. Veja o terminal." });
                break;
        }
    }
});


app.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})