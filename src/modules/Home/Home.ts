import { Options, Vue } from 'vue-class-component';
import ClarifaiComponent from '@/components/Clarifai/index.vue'; 
import axios from 'axios';


@Options({
    name: 'home',
    components: {
        ClarifaiComponent,
    },
})
export default class Dashboard extends Vue {
    imageInfo: any;

    mounted() {
       this.getImageInfo(); 
    }

    public  getImageInfo = async () => {
        try {
            const response: any = await axios.get(process.env.VUE_APP_SERVER_API+'/api/auth/image-detection/info', {
                headers: {
                "authorization": localStorage.getItem("token")
          }}); 
          console.log(response.data);
          this.$nextTick(()=>{
            this.imageInfo = JSON.parse(JSON.stringify(response.data));

          })
          console.log( "&&&&>>>>",this.imageInfo);
        } catch(err) {
            console.log("something went wrong", err); 
        }
    }
}
