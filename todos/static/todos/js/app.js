document.addEventListener("DOMContentLoaded", function() {

    const noTaskadded = "No tasks added yet!";
    const outerLight = "M0 0h24v24H0z";
    const innerLight = "M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z";
    const outerDark = "M0 0h24v24H0z";
    const innerDark = "M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z";
    const outer = document.getElementById("outer");
    const inner = document.getElementById("inner");
    const currentTheme = localStorage.getItem("theme");
    const currentOuter = localStorage.getItem("dOuter");
    const currentInner = localStorage.getItem("dInner");
    const btnSwitcher = document.getElementById("switcher");
    const body = document.getElementsByTagName("body")[0];
    const lista = document.getElementById("lista");



    if(currentTheme != null && currentOuter != null && currentInner != null) {
        const oldTheme = body.getAttribute("class");
        body.classList.replace(oldTheme, currentTheme);
        outer.setAttribute("d", currentOuter);
        inner.setAttribute("d", currentInner);
    }

    btnSwitcher.addEventListener("click", function() {
        const currentTheme =  body.getAttribute("class");

        changeTheme(currentTheme); 
    });
    
    const changeTheme = theme => {
        let newTheme = "";
        let newOuter = "";
        let newInner = "";

        if(theme === "dark") {
            body.classList.replace("dark", "light");
            outer.setAttribute("d", outerLight);
            inner.setAttribute("d", innerLight);
            newOuter = outerLight;
            newInner = innerLight;
            newTheme = "light";
        } else {
            body.classList.replace("light", "dark");
            outer.setAttribute("d", outerDark);
            inner.setAttribute("d", innerDark);
            newOuter = outerDark;
            newInner = innerDark;
            newTheme = "dark";
        }
        localStorage.clear();
        localStorage.setItem("theme", newTheme);
        localStorage.setItem("dOuter", newOuter);
        localStorage.setItem("dInner", newInner);
    }

    /*********************************************************************************/


    // esta funcion la encontramos en la documentacion oficial de Django
    // nos captura la cookie en donde se encuentra el token del form // sin este no nos permite realizar la operacion 
    function getCookie(name) { let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    // guardamos el token
    const csrftoken = getCookie('csrftoken');

    // capturamos el formulario por medio de su id
    const formTask = document.getElementById("formTask");

    // agregamos un listener para que cuando se envia el formulario
    // realicemos las operaciones necesarias para
    // guardar al nueva tarea
    formTask.addEventListener("submit", function(e) {
        // deshabilitar la funcion default del formulario 
        e.preventDefault();

        // guardamos la url --> esto necesitamos en el fetch
        const url = formTask.getAttribute('data-url');

        // creamos la data a partir del formulario
        const formData = new FormData(formTask);

        // y aqui la magia del fetch
        // le pasamos la url, y luego un objeto con las distintos atributos necesarios
        // para enviar la data que capturamos del formulario
        // y que django procese esa data y nos devuelva luego la nueva tarea
        fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": csrftoken
            }
        })
        .then(res => {
            // convertimos la respuesta a json
            return res.json()
        })
        // capturamos cualquier posible error
        .catch(error => console.error("Error: ", error))
        .then(function(data) {

            addTask(data);
            
        });
    });


    const addTask = data => {

        const li = document.createElement("li");
        li.classList.add("list-item");
        li.id = "li" + data.new_task.id;

        const input = document.createElement("input");
        input.classList.add("list-item-check");
        input.type = "checkbox";
        input.id = data.new_task.id;

        const label = document.createElement("label");
        label.classList.add("list-item-label", "bold");
        label.htmlFor = data.new_task.id;
        label.id = "label" + data.new_task.id;


        const div = document.createElement("div");
        div.classList.add("list-item-text");

        const span = document.createElement("span");
        span.classList.add("task-name");
        span.innerHTML = data.new_task.name;


        div.appendChild(span);

        const btn = document.createElement("button");
        btn.classList.add("btn-delete");
        btn.id = data.new_task.id;



        const icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add("fa-trash");


        btn.appendChild(icon);

        label.appendChild(div);
        label.appendChild(btn);

        li.appendChild(input);
        li.appendChild(label);
        
        lista.prepend(li);
        
        // limpiamos el formulario
        formTask.reset(); 
    }

    lista.childNodes.forEach(item => {
        if(item.tagName === 'LI') {
            const label = item.lastElementChild;
            const btnDelete = label.lastElementChild;

            btnDelete.addEventListener("click", function(){
                const btnId = btnDelete.getAttribute("id");
                const taskId = parseInt(btnId);

                fetch(`/delete_one/${taskId}/`)
                    .then(res => res.json())
                    .then(data => {
                        lista.removeChild(item);
                    })
                    .catch(error => console.error(error));
            })
        }
    })


    lista.childNodes.forEach(item => {
        if(item.tagName === 'LI') {
            const task = item.firstElementChild;
            const label = item.lastElementChild;

            task.addEventListener("change", function(){
                const taskId = parseInt(task.getAttribute("id"));

                fetch(`/change-status/${taskId}/`)
                    .then(res => res.json())
                    .then(data => {

                        if(data.task.status) {
                            label.classList.add("checked");
                            label.classList.remove("bold");
                            task.checked = true;
                        } else {
                            label.classList.remove("checked");
                            label.classList.add("bold");
                            task.checked = false;
                        }
                    })
                    .catch(error => console.error(error));
            })
        }
    })

});
