// First React
import { useEffect, useState } from 'react';

// Second Next.js and Three Archivos terceros
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { Button, Card, Container, Grid, Image, Text } from '@nextui-org/react';

import confetti from 'canvas-confetti';

// Four Files propios
import { Layout } from '../../components/layouts';
import pokeApi from '../../api/pokeApi';
import { Pokemon } from '../../interfaces';
import { getPokemonInfo, localFavorites } from '../../utils';

interface Props {
  pokemon: any;
}

const PokemonPage:NextPage<Props> = ({ pokemon }) => {

  const [isInFavorites, setIsInFavorites] = useState( localFavorites.existInFavorites( pokemon.id ) );

  const onToggleFavorite = () => {
    localFavorites.toggleFavorite( pokemon.id );
    setIsInFavorites( !isInFavorites );

    if ( isInFavorites ) return;

    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      angle: -100,
      origin: {
        x: 1,
        y: 0,
      }
    })
  }

  // NodeJS y Cliente

  return (
    <Layout title={ pokemon.name }>

      <Grid.Container css={{ marginTop: '5px' }} gap={ 2 }>
        <Grid xs={ 12 } sm={ 4 }>
          <Card hoverable css={{ padding: '30px' }}>
            <Card.Body>
              <Card.Image 
                src={ pokemon.sprites.other?.dream_world.front_default || '/no-image.png' }
                alt={ pokemon.name }
                width="100%"
                height={ 200 }
              />
            </Card.Body>
          </Card>
        </Grid>

        <Grid xs={ 12 } sm={ 8 }>
          <Card css={{ padding: '5px' }}>
            <Card.Header css={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text h1 transform='capitalize'>{ pokemon.name }</Text>
              <Button 
                onClick={ onToggleFavorite }  
                color="gradient" 
                ghost={ !isInFavorites }
              >
                { isInFavorites ? 'En Favoritos' : 'Guardar en Favoritos' }
              </Button>
            </Card.Header>

            <Card.Body>
              <Text size={ 30 }>Sprites</Text>
              
              <Container direction='row' display='flex' gap={ 0 }>
                <Image 
                  src={ pokemon.sprites.front_default }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />

                <Image 
                  src={ pokemon.sprites.back_default }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />

                <Image 
                  src={ pokemon.sprites.front_shiny }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />

                <Image 
                  src={ pokemon.sprites.back_shiny }
                  alt={ pokemon.name }
                  width={ 100 }
                  height={ 100 }
                />
              </Container>
            </Card.Body>
          </Card>
        </Grid>

      </Grid.Container>

    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const pokemon151 = [ ...Array(151) ].map((_, index) => `${ index+1 }`);

  return {
    paths: pokemon151.map( (id) => ({ 
      params: { id } 
    }))
    ,
    // fallback: false // 404
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };

  const pokemon = await getPokemonInfo( id );

  if ( !pokemon ) {
    return {
      redirect:  {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      pokemon
    },
    revalidate: 86400, // seg -> 1 day -> 24 hrs -> 60seg x 60seg x 24hrs 
  }
}

export default PokemonPage;