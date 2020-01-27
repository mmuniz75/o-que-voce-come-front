const handleResponseError = (error) => {
    console.log(error)
    if(error.response != undefined && error.response.data && error.response.data.message) {
      return error.response.data.message 
    }else {
       return "Ocorreu um erro.Tente novamente mais tarde."
    }  

}

export default handleResponseError;