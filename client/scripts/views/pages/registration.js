import Component from '../component';

import Users from '../../models/users';

import { disableBtn } from '../../helpers/utils';

import { validateValues } from '../../helpers/utils';

import { showActionMsg } from '../../helpers/utils';

class Registration extends Component {
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
                        <h1 class="page-title">Sign up</h1>
                        <div class="access__box">
                            <label for="username" class="label">Username</label>
                            <input type="text" id="username" name="username">
                        </div>
                        <div class="access__box">
                            <label for="password" class="label">Password</label>
                            <input type="password" id="password" name="password">
                        </div>
                        <div class="access__btns">
                            <button class="btn registration-btn" disabled>Sign up</button>
                            <a href="#/login">Sign in</a>
                        </div> 
                    </div>
                </div>
        `;
    }

    static afterRender() {
        Registration.setActions();
    }

    static setActions() {
        const registrBtn = document.getElementsByClassName('registration-btn')[0],
            usernameInput = document.getElementById('username'),
            passwordInput = document.getElementById('password');

        usernameInput.onkeyup = () => disableBtn(registrBtn, usernameInput, passwordInput);
        passwordInput.onkeyup = () => disableBtn(registrBtn, usernameInput, passwordInput);
        registrBtn.onclick = () => Registration.saveUser(registrBtn, usernameInput, passwordInput);
    }

    static async saveUser(registrBtn, usernameInput, passwordInput) {
        if (validateValues(registrBtn, usernameInput, passwordInput)) {
            let newUser = {
                username: usernameInput.value,
                password: passwordInput.value
            };

            const response = await Users.sendNewUserData(newUser);

            if (response.message == 'You have successfully registered!') {
                showActionMsg(`${response.message}`, '');
                location.hash = '/login';
            } else {
                showActionMsg(`${response.message}`, 'action-msg_wrong-input');
            }
        }
    }
}
export default Registration;