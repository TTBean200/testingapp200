import { StorageImage } from "@aws-amplify/ui-react-storage";
import { type Place } from "./Places";
import { NavLink } from "react-router";
import { getUrl } from "aws-amplify/storage";



export default function PlaceComponent(props: {
    place: Place
}) {

    function renderPhotos() {
        const rows: any[] = []
        props.place.thumbs?.forEach((photo, index) => {
            if (photo) {
                if (photo.includes('/files')) {

                    rows.push(<p>contains file : {photo}</p>)

                    //rows.push(<p>contains file : {photo.split('/').pop()}</p>)
                }else {

                    console.log("contains photos")
                /**
                 * Files can be also handled with the aws-amplify/storage package:
                 * https://docs.amplify.aws/angular/build-a-backend/storage/download-files/
                 */
                    rows.push(<StorageImage path={photo} alt={photo} key={index} />)
                }
            }
        })
        
        return rows;
    }

    return <div className="placeComponent">
        <h2>{props.place.name}</h2>
        <NavLink to={'/places/' + props.place.id}>{props.place.name}</NavLink>
        <p>{props.place.description}</p>
        {renderPhotos()}
    </div>



}