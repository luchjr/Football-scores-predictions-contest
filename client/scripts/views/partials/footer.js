import Component from '../../views/component';

class Footer extends Component {
    static async render() {
        return `
            <footer class="footer">                   
                &copy; All Rights Reserved, 2022                
            </footer>
        `;
    }
}

export default Footer;