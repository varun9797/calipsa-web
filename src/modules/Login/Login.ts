import axios from 'axios';
import { Options, Vue } from 'vue-class-component';

@Options({
    computed: {
        posts() {
             return this.$store.getters.posts;
          },
      },
})
export default class Dashboard extends Vue {
    $store: any;
    uname: string;
    isConflict: boolean = false;
    async login() {
        try {
            const response = await axios.post(process.env.VUE_APP_SERVER_API + '/api/login', {
                username: this.uname
            });
            if (response.data && response.data.token) {
                this.storeToken(response.data.token);
                this.isConflict = false;
                this.$nextTick();
                this.$router.push("/home")
            }
        } catch (err: any) {
            if (err && err.response.status == 409) {
                this.isConflict = true;
                this.$nextTick();
            }
        }
    }

    storeToken(token: string) {
        localStorage.setItem("token", token);
    }
}
