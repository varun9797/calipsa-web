import { Options, Vue } from 'vue-class-component';
import axios from 'axios';


@Options({
    name: 'ClarifaiComponent',
})
export default class Clarifai extends Vue {
    USER_ID = process.env.VUE_APP_USER_ID;
    PAT = process.env.VUE_APP_PAT;
    APP_ID = process.env.VUE_APP_APP_ID;
    MODEL_ID = process.env.VUE_APP_MODEL_ID;
    MODEL_VERSION_ID = process.env.VUE_APP_MODEL_VERSION_ID;
    CLARIFAI_API = process.env.VUE_APP_CLARIFAI_API;
    IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
    IMAGE_BYTES: any;
    imageInfo: any;
    raw = {};
    requestOptions = {};

    public async getImageInfoFromClarifai(e: any): Promise<void> {
        this.IMAGE_BYTES = String(await this.toBase64(e.target.files[0])).replace(/^data:(.*,)?/, '');;
        this.setRequestOption();
        fetch(this.CLARIFAI_API + "/v2/models/" + this.MODEL_ID + "/versions/" + this.MODEL_VERSION_ID + "/outputs", this.requestOptions)
        .then(response => response.text())
        .then(result => {
            this.imageInfo = JSON.parse(result).outputs[0].data.concepts;
            this.updateImageInfo();
        })
        .catch(error => console.log('error', error));
    }

    public async updateImageInfo() {
            try {
                const response = await axios.post(process.env.VUE_APP_SERVER_API+'/api/auth/image-detection/upload', {
                    data: this.imageInfo,
               }, {headers: {
                    "authorization": localStorage.getItem("token")
              }}); 
            } catch(err) {
                console.log("something went wrong"); 
            }
    }

    public toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    public setRequestOption(): void {
        this.raw = JSON.stringify({
            "user_app_id": {
                "user_id": this.USER_ID,
                "app_id": this.APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "base64": this.IMAGE_BYTES
                        }
                    }
                }
            ]
        });
    
        this.requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + this.PAT
            },
            body: this.raw
        };
    
    }
}
