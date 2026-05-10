@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

body {
    background: linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #e94560);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* NAVBAR SUPERIOR */
#navbar {
    width: 100%; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    position: sticky; top: 0; z-index: 50;
}
.nav-logo { font-size: 20px; font-weight: bold; color: #1a1a2e; }
.nav-categorias button {
    background: none; color: #1a1a2e; width: auto; box-shadow: none; margin: 0 5px; padding: 5px 10px;
}
.nav-categorias button:hover { background: #e94560; color: white; }

.nav-user { position: relative; cursor: pointer; font-weight: 600; color: #1a1a2e; }
.dropdown-content {
    position: absolute; right: 0; top: 30px; background: white;
    min-width: 200px; box-shadow: 0px 8px 16px rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden;
}
.dropdown-content a { color: black; padding: 12px 16px; display: block; text-decoration: none; font-weight: normal; }
.dropdown-content a:hover { background-color: #f1f1f1; }

#auth-container {
    background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3); width: 100%; max-width: 500px; text-align: center;
    margin-top: 10vh;
}

#eventos-container { max-width: 1100px; width: 100%; padding: 20px; }

h2, h3 { color: #1a1a2e; margin-bottom: 20px; font-weight: 600; }

.form-row { display: flex; gap: 10px; }
.form-row input { width: 50%; }

input, select {
    width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #ccc;
    border-radius: 8px; font-size: 14px; background: #f9f9f9;
}
input:focus, select:focus { border-color: #e94560; outline: none; background: #fff; }

button {
    width: 100%; padding: 14px; background: #e94560; color: white; border: none;
    border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s;
}
button:hover { background: #d83350; transform: translateY(-2px); }

/* TARJETAS */
#listaEventos { display: grid; gap: 25px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.card {
    position: relative; border-radius: 15px; overflow: hidden; min-height: 280px;
    display: flex; flex-direction: column; justify-content: flex-end;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3); transition: transform 0.3s;
}
.card:hover { transform: scale(1.03); }
.card-background { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: 1; }
.card-content { position: relative; z-index: 2; padding: 20px; color: white; text-align: left; }
.card h3 { font-size: 22px; margin-bottom: 5px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
.card .desc { font-size: 13px; color: #ddd; margin-bottom: 15px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
.card-info {
    display: flex; justify-content: space-between; font-size: 12px; font-weight: 600;
    margin-bottom: 10px; background: rgba(0,0,0,0.6); padding: 5px 10px; border-radius: 5px;
}
.btn-reservar { background: #23a6d5; margin-top: 10px; padding: 10px; font-size: 14px; }
.btn-reservar:hover { background: #1b8eb8; }

/* MODALES ARREGLADOS (Se superponen a todo) */
.modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center;
}
.modal-content { background: white; padding: 30px; border-radius: 15px; width: 100%; max-width: 400px; text-align: left;}
.modal-content p { color: #333; margin-bottom: 5px; font-size: 14px;}
.total-price { color: #e94560; font-size: 22px; text-align: center; margin: 15px 0; }
.modal-buttons { display: flex; gap: 10px; }
.btn-cancelar { background: #ccc; color: #333; }
.btn-cancelar:hover { background: #aaa; }

/* WIDGET DE SOPORTE */
.support-btn {
    position: fixed; bottom: 20px; right: 20px; background: #2c3e50; color: white;
    padding: 12px 20px; border-radius: 50px; cursor: pointer; font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 100;
}
.support-widget {
    position: fixed; bottom: 70px; right: 20px; background: white; width: 300px;
    border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden; z-index: 99;
}
.support-header { background: #2c3e50; color: white; padding: 10px 15px; display: flex; justify-content: space-between; }
.support-header h4 { margin: 0; color: white;}
.support-body { padding: 15px; font-size: 13px; }
.support-body details { margin-bottom: 10px; background: #f1f1f1; padding: 8px; border-radius: 5px; cursor: pointer;}