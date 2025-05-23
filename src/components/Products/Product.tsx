import * as React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardLoader from '../Loaders/CardLoader';
import { useParams } from 'react-router-dom';
import { Paper, Grid } from '@material-ui/core';
import ItemLoader from '../Loaders/ItemLoader';
import ProductLocationMap from '../Map/ProductLocationMap';
import { useSelector } from 'react-redux';
import { selectProducts } from '../../redux/productsReducer';
import { selectShops } from '../../redux/shopsReducer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing(2),
            margin: 'auto',
            background: 'none',
            color: 'white'
        },
        image: {
            width: 128,
            height: 128,
        },
        img: {
            margin: 'auto',
            display: 'block',
            maxWidth: '100%',
            maxHeight: '200px',
        },
        map: {
            width: '100%'
        }
    }),
);

const Product = () => {
    const classes = useStyles();
    let { id } = useParams();
    const products = useSelector(selectProducts);
    const [product, setProduct] = React.useState(null);

    React.useEffect(() => {
        if (!products || !products.length) return;

        const product = products.find((el) => el.id === id);
        if (!product) return;
        setProduct(product);
    }, [products])

    const shops = useSelector(selectShops);
    const [productShop, setProductShop] = React.useState(null);

    React.useEffect(() => {
        if (!shops || !shops.length || !product) return;

        const productShop = shops.find((el) => el.id === product.shopId)

        if (!productShop) return;

        setProductShop(productShop);
    }, [shops, product])

    const mediaLoaded = !!product && !!productShop;

    return (
        <div className={classes.root}>
            {mediaLoaded ?
                <Paper className={classes.paper}>
                    <Grid container spacing={4}>
                        <Grid item>
                            {product && product.image ?
                                <img className={classes.img} alt="complex" src={product.image} />
                                : <div>
                                    <CardLoader loaded={product && product.image} />
                                </div>}
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Description: {product.description}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" gutterBottom>
                                        Shop location:
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {productShop.name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        {productShop.address}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                        Add to chart
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" gutterBottom>
                                        Product location in shop:
                                    </Typography>
                                </Grid>
                                <Grid item className={classes.map}>
                                    <ProductLocationMap productCoordinates={product.coordinates} mapImgUrl={productShop.mapImage} />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1">Price: {product && product.price || '...'} lv.</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                : <ItemLoader loadingMessage="Loading product info. Please wait..." />}
        </div>
    )
}

export default React.memo(Product);