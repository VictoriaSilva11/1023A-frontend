interface ContainerProps(props:ContainerProps){
    nome:string
}
let contador = 10
function Container(props:ContainerProps){
   contador = 10
}
  return(
    <>
     <h1>{props.nome}</h1>
     valor contador:{contador}
     <button onClick={mudar()}>mudar</button>
     </>
  )
}
export default Container