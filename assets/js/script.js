const conteudoDoTexto = document.querySelector("textarea")
const botaoCriptografar = document.getElementById("criptografar")
const botaoDescriptografar = document.getElementById("descriptografar")
const copiaTexto = document.getElementById("conteudo_mensagem")

const htmlInicialCopiaTexto = copiaTexto.innerHTML

let listaCriptografada = []
let listaChaves = []
const inputCopiaDoTexto = document.createElement("div")
const botaoCopiar = document.createElement("button")

inputCopiaDoTexto.id = "input-text-copy"
botaoCopiar.id = "button-copy"
botaoCopiar.innerText = "Copiar"

function criptografarTexto(mensagem) {
    const chave = crypto.randomUUID()
    const iv = CryptoJS.lib.WordArray.random(16);
    const textoCriptografar = CryptoJS.AES.encrypt(mensagem, chave, { iv: iv }).toString()
    listaCriptografada.push(textoCriptografar)
    listaChaves.push(chave)
    return textoCriptografar
}

function descriptografarTexto(mensagem) {
    const index = listaCriptografada.indexOf(mensagem)
    if (index === -1) return null
    const chave = listaChaves[index]
    const iv = CryptoJS.lib.WordArray.random(16)
    return CryptoJS.AES.decrypt(mensagem, chave, { iv: iv }).toString(CryptoJS.enc.Utf8)
}

function updateCopiaTexto(texto) {
    inputCopiaDoTexto.innerText = texto;
    copiaTexto.innerHTML = '';
    copiaTexto.appendChild(inputCopiaDoTexto);
    copiaTexto.appendChild(botaoCopiar);
    botaoCopiar.style.cursor = "pointer";
    botaoCopiar.style.fontSize = "16px";
}

function contemMaiusculasOuAcentos(texto) {
    const regexMaiusculas = /[A-Z]/
    const regexAcentos = /[À-ÿ]/
    return regexMaiusculas.test(texto) || regexAcentos.test(texto)
}

botaoCriptografar.addEventListener('click', function (evento) {
    evento.preventDefault()
    const texto = conteudoDoTexto.value
    if (texto === '') {
        Swal.fire({
            title: "Atenção",
            text: "Por favor, insira algum texto antes de criptografar.",
            icon: "warning",
            confirmButtonColor: "#0A3871",
            confirmButtonText: "OK"
        });
        return false;
    } else if (contemMaiusculasOuAcentos(texto)) {
        conteudoDoTexto.value = 'O texto não deve conter letras maiúsculas ou acentos.'
    } else {
        const textoCriptografado = criptografarTexto(texto)
        updateCopiaTexto(textoCriptografado)
    }
})

botaoDescriptografar.addEventListener('click', function (evento) {
    evento.preventDefault()
    const textoDescriptografado = descriptografarTexto(conteudoDoTexto.value)
    if (textoDescriptografado !== null) {
        updateCopiaTexto(textoDescriptografado)
    }
})

botaoCopiar.addEventListener('click', function () {
    const range = document.createRange()
    range.selectNode(inputCopiaDoTexto)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand("copy")
    window.getSelection().removeAllRanges()
    conteudoDoTexto.value = ''
    updateCopiaTexto('Nenhuma mensagem')
})

conteudoDoTexto.addEventListener("change", function () {
    this.value = this.value.replace(/\n/g, '')
})

function limparCampo() {
    conteudoDoTexto.value = ''
    copiaTexto.innerHTML = htmlInicialCopiaTexto
}