import React from 'react';
import { Button,Image,View,Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class Camera extends React.Component{

    constructor(){
        super()
        this.state = {
            image:null
        }
    }

    componentDidMount(){
        this.getpermission()
    }

    getpermission = async() => {
        if(Platform.OS != "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status != "granted"){
                Alert.alert("We need camera permissions")
            }
        }
    }

    pickimage = async() => {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({
                    image:result.data
                })
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    uploadImage = async(uri) => {
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const filetoupload = {uri:uri,name:filename,type:type}
        data.append("digit",filetoupload)
        fetch("http://e2eb45732a78.ngrok.io/predictdigit",{
            method:"POST",
            body:data,
            headers:{"content-type":"multipart/form-data"}
        })
        .then((Response)=>{
            Response.json()
        })
        .then((result)=>{
            console.log("Success : ",result)
        })
        .catch((error)=>{
            console.log("Error : ",error)
        })
    }

    render(){
        let image = this.state.image
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Button title="Pick An Image" onPress={this.pickimage}></Button>
            </View>
        )
    }
}