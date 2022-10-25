import Component from '../../views/component';

import Users from '../../models/users';

import { disableBtn } from '../../helpers/utils';

import { validateValues } from '../../helpers/utils';

import { showActionMsg } from '../../helpers/utils';

class Login extends Component {
    static async getData() {
        const token = sessionStorage.getItem('token'),
            username = sessionStorage.getItem('username');
        if (token && username) {
            location.hash = '/logout';
        }
    }

    static async render() {
            return `
                <div class="access-wrapper">
                    <img class="logo-major" src="icons/logo_01_38.png" alt="logo text">
                    <div class="access">
                        <h1 class="page-title">Sign in</h1>
                        <div class="access__box">
                            <label for="username" class="label">Username</label>
                            <input type="text" id="username" name="username">
                        </div>
                        <div class="access__box">
                            <label for="password" class="label">Password</label>
                            <input type="password" id="password" name="password">
                        </div>
                        <div class="access__btns">
                            <button class="btn login-btn" disabled>Sign in</button>
                            <a href="#/registration">Sign up</a>
                        </div> 
                    </div>
                </div>
            `;
    }

    static afterRender() {
        Login.setActions();
    }

    static setActions() {
        const loginBtn = document.getElementsByClassName('login-btn')[0],
            usernameInput = document.getElementById('username'),
            passwordInput = document.getElementById('password');

        usernameInput.onkeyup = () => disableBtn(loginBtn, usernameInput, passwordInput);
        passwordInput.onkeyup = () => disableBtn(loginBtn, usernameInput, passwordInput);
        loginBtn.onclick = () => Login.setUser(loginBtn, usernameInput, passwordInput);
    }

    static async setUser(loginBtn, usernameInput, passwordInput) {
        if (validateValues(loginBtn, usernameInput, passwordInput)) {
            const user = {
                username: usernameInput.value,
                password: passwordInput.value
            },
                response = await Users.sendUserData(user);

            if (response.token) {
                const userId = response.username;

                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('username', userId);
                location.hash = `/about/${userId}`;
            } else {
                showActionMsg(`${response.message}`, 'action-msg_wrong-input');
            }
        }
    }
}

export default Login;