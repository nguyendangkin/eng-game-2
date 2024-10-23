import { Helmet } from "react-helmet";

const HeadAdSense = () => {
    return (
        <Helmet>
            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9997544990020242"
                crossorigin="anonymous"
            ></script>
        </Helmet>
    );
};

export default HeadAdSense;
