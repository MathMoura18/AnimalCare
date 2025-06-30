import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat/Chat";
import DoacaoPopup from "../components/Doacao/Doacao";
import PerfilPopup from '../components/PerfilPopup';

import ".././css/style.css"
import ".././css/Footer.css"

export const Sobre = () => {
    const [chatVisivel, setChatVisivel] = React.useState(false);
    const [doacaoVisivel, setDoacaoVisivel] = React.useState(false);
    const [perfilVisivel, setPerfilVisivel] = React.useState(false);

    return <>
        <Header
            onChatClick={() => setChatVisivel((v) => !v)}
            onDoacaoClick={() => setDoacaoVisivel((v) => !v)}
            onPerfilClick={() => setPerfilVisivel((v) => !v)}
        />
        <div className="sobre">
            <h1>Sobre o AnimalCare</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et aliquet sapien. Cras nec euismod felis, at pharetra augue. Duis lacinia ut lacus non tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tempus sem lorem, sit amet pretium libero finibus nec. Duis in urna arcu. Nam sollicitudin eros non facilisis ullamcorper. In hac habitasse platea dictumst. Mauris interdum aliquam metus in finibus. Duis porta laoreet purus vel imperdiet. In ut tincidunt dolor, id venenatis velit. In id pretium dui, sit amet convallis lectus. <br /><br />

                Sed dignissim interdum velit, ac tincidunt nulla. Donec efficitur erat non erat porta, in consequat turpis convallis. In sit amet tempus est, id sollicitudin orci. Nulla quis diam dolor. Aliquam condimentum nibh ut mauris tempor, vel dapibus ex blandit. Proin auctor eros ante, ac convallis tellus vehicula malesuada. Vivamus pharetra laoreet congue. Sed auctor non nibh ac semper. Aliquam faucibus eu risus in rutrum. Curabitur nec orci vitae magna aliquam sollicitudin id at felis. Nullam sit amet arcu sed odio finibus tempor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. <br /><br />

                Morbi feugiat eros in placerat tincidunt. Donec ac odio non libero ultrices eleifend ac molestie metus. Curabitur quis sem mattis, tristique nisl sit amet, accumsan ligula. Ut ut scelerisque lorem. Duis at lorem gravida nunc mattis posuere sed et odio. Morbi suscipit metus orci, ut cursus augue iaculis sed. Ut pulvinar convallis arcu ut convallis. Sed efficitur dictum sem ac scelerisque. In hac habitasse platea dictumst. Aliquam nec ante rhoncus, rutrum leo ut, dapibus lorem. Phasellus euismod, nisi ac fringilla vestibulum, nunc neque ullamcorper nunc, non commodo mi nibh et leo. Ut iaculis dui et nisl hendrerit, at efficitur diam blandit. In hac habitasse platea dictumst. <br /><br />

                Nulla varius, magna sed ultrices malesuada, odio enim venenatis ipsum, blandit lacinia sapien lectus facilisis neque. Sed sed dui at metus tincidunt gravida et sed nisl. Mauris tincidunt neque non eros sollicitudin, auctor condimentum erat placerat. Aenean non ante eget nisi laoreet venenatis quis eu est. Suspendisse ipsum felis, consequat vel luctus non, posuere eget est. Suspendisse ornare diam vitae metus posuere ultricies. In non mi libero. Aliquam velit urna, hendrerit eget tellus id, eleifend venenatis dolor. Donec nulla libero, ultrices vitae ipsum quis, consequat blandit ipsum. Sed at maximus magna. Mauris dolor metus, accumsan vel facilisis id, pharetra nec diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; <br /><br />

                Donec feugiat neque imperdiet diam varius, quis efficitur enim viverra. Nulla varius velit mauris, et egestas augue congue in. Nulla accumsan molestie arcu et malesuada. Nam eu nisl vitae ipsum hendrerit aliquam non ac sem. Curabitur eu aliquam elit, non vehicula diam. Pellentesque nisl diam, ornare lobortis laoreet ut, consectetur bibendum orci. Aenean tristique velit malesuada sollicitudin ultrices. Praesent ullamcorper, lectus et porttitor condimentum, ipsum nisl tincidunt nulla, sed faucibus arcu leo non sapien. Donec vel diam at metus vehicula elementum in non orci. Mauris ut lectus interdum, pharetra nunc ut, accumsan sapien. Nunc ut metus sed diam elementum vulputate. Curabitur sit amet felis viverra, mollis turpis vitae, efficitur tellus. Morbi diam magna, rhoncus vitae vehicula sit amet, dapibus vitae urna. Proin tincidunt enim et tortor ultricies, ultrices mattis nulla sagittis. Donec iaculis mi at interdum laoreet.</p>
        </div>

        <Footer />

        {chatVisivel && <Chat onClose={() => setChatVisivel(false)} />}
        {doacaoVisivel && <DoacaoPopup onClose={() => setDoacaoVisivel(false)} />}
        {perfilVisivel && <PerfilPopup onClose={() => setPerfilVisivel(false)} />}
    </>
}