import Component from '../../views/component';

class Logout extends Component {
    static async getData() {
        return sessionStorage.getItem('username');
    }

    static async render(username) {
        return `
            <div class="access-wrapper">
                <img class="logo-major" src="icons/logo_01_38.png" alt="logo text">
                <div class="access">
                    <h1 class="page-title">Hi, ${username}!</h1>
                    <div class="access__box">You are logged in.</div>
                    <button class="btn logout-btn">Logout</button>
                </div>
            </div>
    `;
    }

    static afterRender() {
        const logoutBtn = document.getElementsByClassName('logout-btn')[0];

        logoutBtn.onclick = () => {
            sessionStorage.clear();
            location.hash = '/';
        };
    }
}

export default Logout;