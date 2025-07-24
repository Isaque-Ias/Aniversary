const parent = document.getElementById("message-flow");
const messageBox = document.getElementById("message");

let step;
let perfis;
let coordenacoes;
let topicos;

let selectUser;
let selectPerfil;
let selectCoordenacao;
let selectTopico;

let holdingShift = false;

function mapPerfil(value) {
    // subtrai-se 2 devido as sugestões começarem no número 1.
    value = value - 1;
    if (value < perfis.length && value >= 0) {
        return perfis[parseInt(value)].id;
    }
    return -1;
}

function mapCoordenacao(value) {
    // subtrai-se 2 devido as sugestões começarem no número 1.
    value = value - 1;
    if (value < coordenacoes.length && value >= 0) {
        return coordenacoes[parseInt(value)].id;
    }
    return -1;
}

function mapTopico(value) {
    // subtrai-se 2 devido as sugestões começarem no número 1.
    value = value - 1;
    if (value < topicos.length && value >= 0) {
        return topicos[parseInt(value)].id_resposta;
    }
    return -1;
}


messageBox.addEventListener("keyup", function(e) {
    if (e.key == 16) {
        holdingShift = false;
    }
})

messageBox.addEventListener("keydown", function(e) {
    if (e.key == 16) {
        holdingShift = true;
    }

    if (e.key == "Enter") {
        if (!holdingShift) {
            e.preventDefault();
            SendMessage();
        }
    }
})

document.addEventListener("DOMContentLoaded", function() {
    fetchData("start", function(data) {
        GenerateResponse(data);
    });
});

function fetchData(url, operation) {
    fetch(url)
    .then(response => {
        if (!response.ok) throw new Error("Resposta de rede não foi ok");
        return response.json();
    })
    .then(data => {
        step = data.next_step;
        operation(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function GenerateInput(message) {
    const mainMessage = document.createElement("p");

    mainMessage.innerHTML = "Você: " + message;

    parent.appendChild(mainMessage);
}

function GenerateResponse(data, goBack=false) {
    responseStructure = [];

    if ("message" in data) {
        responseStructure.push(GenerateResponseText(data.message));
    }
    if ("image" in data && data.image !== "") {
        responseStructure.push(GenerateImage(data.image));
    }
    if ("options" in data) {
        responseStructure.push(GenerateResponseList(data.options, goBack));
    }

    const message = document.createElement("div");

    for (const structure in responseStructure) {
        message.appendChild(responseStructure[structure]);
    }

    parent.appendChild(message);
}

function GenerateResponseText(message) {
    const mainMessage = document.createElement("p");

    mainMessage.innerHTML = "Robô DIAD: " + message;
    
    return mainMessage;
}

function GenerateResponseList(list, goBack) {
    const mainList = document.createElement("ol");

    for (const message in list) {
        const subListElement = document.createElement("li");
        const subMessage = document.createElement("p");
        
        subListElement.innerHTML = list[message].nome;
        
        subListElement.appendChild(subMessage);
        mainList.appendChild(subListElement);
    }
    
    if (goBack) {
        const subListElement = document.createElement("li");
        const subMessage = document.createElement("p");
        
        subMessage.innerHTML = "Voltar";
        
        subListElement.appendChild(subMessage);
        mainList.appendChild(subListElement);
    }

    return mainList;
}

function GenerateImage(image) {
    if (image == "" || image == null) {
        return;
    } 
    const mainFigure = document.createElement("figure");
    const mainImage = document.createElement("img");
    
    mainImage.src = "../static/uploads/" + image;
    
    mainFigure.appendChild(mainImage);
    return mainFigure;
}

function Step1(message, endpointBase) {
    selectUser = message;
    endpoint = endpointBase + "&nome=" + encodeURIComponent(message);

    fetchData(endpoint, function(data) {
        GenerateResponse(data);
        
        perfis = data.options;
    });
}

function Step2(message, endpointBase) {
    selectPerfil = mapPerfil(message);
    endpoint = endpointBase + "&perfil=" + selectPerfil;
    
    fetchData(endpoint, function(data) {
        GenerateResponse(data, true);

        coordenacoes = data.options;
    });
}

function Step3(message, endpointBase) {
    if (parseInt(message) - 1 == coordenacoes.length) {
        step = 1;

        endpointBase = "talk?step=1";
        endpoint = endpointBase + "&nome=" + selectUser;
        
        fetchData(endpoint, function(data) {
            GenerateResponse(data);
        });

        return;
    }

    selectCoordenacao = mapCoordenacao(message);
    endpoint = endpointBase + "&perfil=" + selectPerfil + "&coordenacao=" + selectCoordenacao;

    fetchData(endpoint, function(data) {
        GenerateResponse(data, true);

        topicos = data.options;
    });
}

function Step4(message, endpointBase) {
    if (parseInt(message) - 1 == topicos.length) {
        step = 2;

        endpointBase = "talk?step=2";
        endpoint = endpointBase + "&perfil=" + selectPerfil;
        
        fetchData(endpoint, function(data) {
            GenerateResponse(data, true);
        });

        return;
    }
        
    selectTopico = mapTopico(message);
    endpoint = endpointBase + "&id_resposta=" + selectTopico;

    fetchData(endpoint, function(data) {
        GenerateResponse(data);
    });
}

function Step5(message, endpointBase) {
    endpoint = endpointBase + "&continuar=" + message;

    fetchData(endpoint, function(data) {
        GenerateResponse(data);
    });
}

function Step6() {
    endpoint = "talk?step=6";

    fetchData(endpoint, function(data) {
        GenerateResponse(data);
    });
}

function SendMessage() {
    message = messageBox.value;
    messageBox.value = "";

    if (message == "") {
        return;
    }

    GenerateInput(message);

    endpointBase = `talk?step=${step}`;

    switch(step) {
        case 1:
            Step1(message, endpointBase);

            break;
            
        case 2:
            Step2(message, endpointBase);

            break;
            
        case 3:
            Step3(message, endpointBase);

            break;
            
        case 4:
            Step4(message, endpointBase);

            break;

        case 5:
            Step5(message, endpointBase);

            break;

        case 6:
            Step6();

            break;
    }
};