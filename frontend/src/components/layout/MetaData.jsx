import { useEffect } from 'react';

const MetaData = ({ title }) => {
    useEffect(() => {
        document.title = `${title} - ShopIT`;
    }, [title]);

    return null; // Pas besoin de rendre quoi que ce soit
};

MetaData.defaultProps = {
    title: 'Buy Best Product Online',
};

export default MetaData;