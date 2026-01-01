import React from 'react';
import { useEffect, useState } from "react";
import { checkLoginAndGetName } from "../utils/AuthUtils";
import { NavLink } from "react-router";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { uploadData } from "aws-amplify/storage";



export type CustomEvent = {
    target: HTMLInputElement
}

function CreatePlace() {

    const client = generateClient<Schema>().models.Place;

    const [userName, setUserName] = useState<string | undefined>()
    const [placeName, setPlaceName] = useState<string>('');
    const [placeDescription, setPlaceDescription] = useState<string>('');
    const [placePhotos, setPlacePhotos] = useState<File[]>([]);

    useEffect(() => {
        const handleData = async () => {
            const name = await checkLoginAndGetName();
            if (name) {
                setUserName(name)
            }
        }
        handleData();
    }, [])

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();

        const now =new Date();
        let placePhotosUrls: string[] = [];
        let placePhotosThumbsUrls: string[] = [];

        try {
            
            const place = await client.create({
                name: placeName,
                description: placeDescription,
                photos: placePhotosUrls,
                thumbs: placePhotosThumbsUrls,
                userEmail: userName? userName:'',
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()

            })
        

            if(placeName && placeDescription && userName) {
            
                if (placePhotos && place.data) {
                    const uploadResult = await uploadPhotos(placePhotos, place.data.id)
                    placePhotosUrls = uploadResult.urls;
                    placePhotosThumbsUrls = uploadResult.thumbs;
                }
            
            
                await client.update({

                    id: place.data!.id,
                    photos: placePhotosUrls,
                    thumbs: placePhotosThumbsUrls

                })
            

                console.log(place)
                alert(`Place with id ${place.data?.id} created`)
            
                clearFields();
            }
        }catch (error) {
            
            console.error("An error occurred:", error);
            
        }
    }

    function clearFields() {
        setPlaceName('');
        setPlaceDescription('');
        setPlacePhotos([]);
    }

    function getContentType(fileName: string) {
        const ext= fileName.split('.').pop()?.toLowerCase();
        let resp: string = "";

        switch (ext) {
            case 'pdf':
                resp= 'application/pdf';
                break;

            case 'jpeg':
            case 'jpg':
            case 'png':
            case 'gif':
            case 'bmp':
                resp= 'image/'+ext;
                break; 
            default:
                alert('file type :'+ext+' might not be supported. Contact vendor for supports.')
                resp=''
        }
        return resp
    }

    async function uploadPhotos(files: File[], id: string): Promise<{
        urls: string[]
        thumbs: string[]
    }> {
        const urls: string[] = [];
        const thumbs: string[] = [];
     
        for (const file of files) {
            console.log(`uploading file ${file.name}`)
            const contentType=getContentType(file.name)
            console.log('extension is ', contentType)
            //add if extension is empty 

            if (contentType.startsWith('image')) {

                    const result = await uploadData({
                        data: file,
                        path: `originals/${id}/${file.name}`,
                        options: {
                            contentType: contentType, // Crucial for PDFs
                        }
                    }).result
                    urls.push(result.path);
                    thumbs.push(`thumbs/${id}/${file.name}`)
            }else {
                const result = await uploadData({
                        data: file,
                        path: `originals/${id}/files/${file.name}`,
                        options: {
                            contentType: contentType, // Crucial for PDFs
                        }
                    }).result
                    urls.push(result.path);
                    thumbs.push(`thumbs/files/${file.name}`)
            }
        }
        return {
            urls,
            thumbs
        };
    }


    function previewPhotos(event: CustomEvent) {
        if (event.target.files) {
            const eventPhotos = Array.from(event.target.files);
            const newFiles = placePhotos.concat(eventPhotos)
            setPlacePhotos(newFiles);
        }
    }


    function renderPhotos() {
        const photosElements: React.JSX.Element[] = [];
      
        placePhotos.map((photo: File) => {

            if (getContentType(photo.name).startsWith('image')) {
                photosElements.push(
                <img key={photo.name} src={URL.createObjectURL(photo)} alt={photo.name} height={120} />)
            }else {
                photosElements.push(
               <iframe key={photo.name} src={URL.createObjectURL(photo)} alt={photo.name} height={120} />)
            }
            
        })
        return photosElements
    }

    function renderCreatePlaceForm() {
        if (userName) {
            return (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label>Place name:</label><br />
                    <input value={placeName} onChange={(e) => setPlaceName(e.target.value)} /><br />
                    <label>Place description:</label><br />
                    <input value={placeDescription} onChange={(e) => setPlaceDescription(e.target.value)} /><br />
                    <label>Place photos:</label><br />
                    <input type="file" multiple onChange={(e) => previewPhotos(e)} /><br />
                    {renderPhotos()}<br/>
                    <input type="submit" value='Create place' />
                </form>
            )
        } else {
            return <div>
            <h2>Login to create places:</h2>
            <NavLink to={"/auth"}>Login</NavLink>
        </div>
        }
    }

    return <main>
        {renderCreatePlaceForm()}
    </main>
}

export default CreatePlace