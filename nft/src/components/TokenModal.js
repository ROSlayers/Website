import React, { useState, useEffect } from "react";
import { Carousel, ListGroup, Card, Row } from "react-bootstrap";

import dark_sword from './metadata/images/sword-dark.jpeg';
import twin_sword from './metadata/images/twin-sword.jpg';
import damascus from './metadata/images/damascus.jpeg';
import shield from './metadata/images/shield.jpeg';


export default function TokenModal({ passMetadata }) {

  useEffect( () => {
    passMetadata(items[index]);
  }, []);

  
  const [index, setIndex] = useState(0);
  const [selectedToken, setSelectedToken] = useState({});

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    console.log('Active index: ', selectedIndex, 'index: ', index);
    passMetadata(items[index]);
    console.log('Metadata: ', items[index]);
  };

  // new File([await fs.promises.readFile('pinpie.jpg')]
  let items = [
    {
      name: 'Sword of Zues',
      image: 'https://imgur.com/F4QrUa3.jpeg', // './metadata/images/sword-dark.jpeg',
      description: '',
      attributes: [
        {
          "trait_type": "Base", 
          "value": "Starfish"
        }, 
        {
          "trait_type": "Level", 
          "value": 5
        }, 
        {
          "trait_type": "Stamina", 
          "value": 1.4
        }, 
        {
          "display_type": "boost_number", 
          "trait_type": "Aqua Power", 
          "value": 40
        }, 
        {
          "display_type": "boost_percentage", 
          "trait_type": "Stamina Increase", 
          "value": 10
        }, 
        {
          "display_type": "number", 
          "trait_type": "Generation", 
          "value": 2
        }
      ]
    },
    {
      name: 'Damascus Sword',
      image: 'https://imgur.com/xZv2l6p.jpeg', // './metadata/images/damascus.jpeg',
      description: '',
      attributes: [
        {
          "trait_type": "Base", 
          "value": "Starfish"
        }, 
        {
          "trait_type": "Level", 
          "value": 5
        }, 
        {
          "trait_type": "Stamina", 
          "value": 1.4
        }, 
        {
          "display_type": "boost_number", 
          "trait_type": "Aqua Power", 
          "value": 40
        }, 
        {
          "display_type": "boost_percentage", 
          "trait_type": "Stamina Increase", 
          "value": 10
        }, 
        {
          "display_type": "number", 
          "trait_type": "Generation", 
          "value": 2
        }
      ]
    },
    {
      name: 'Twin Ninja Sword',
      image: "https://i.imgur.com/C6s6C7c.jpeg", //'./metadata/images/twin-sword.jpg',
      description: 'Twin Ninja Sword, with superb precision',
      attributes: [
        {
          "trait_type": "Base", 
          "value": "Starfish"
        }, 
        {
          "trait_type": "Level", 
          "value": 5
        }, 
        {
          "trait_type": "Stamina", 
          "value": 1.4
        }, 
        {
          "display_type": "boost_number", 
          "trait_type": "Aqua Power", 
          "value": 40
        }, 
        {
          "display_type": "boost_percentage", 
          "trait_type": "Stamina Increase", 
          "value": 10
        }, 
        {
          "display_type": "number", 
          "trait_type": "Generation", 
          "value": 2
        }
      ]
    },
    {
      name: 'Shield of Ambience',
      image: "https://imgur.com/ElCwHRF.jpeg", //'./metadata/images/shield.jpeg',
      description: 'Coat of arms shield of Ambience',
      attributes: [
        {
          "trait_type": "Base", 
          "value": "Starfish"
        }, 
        {
          "trait_type": "Level", 
          "value": 5
        }, 
        {
          "trait_type": "Stamina", 
          "value": 1.4
        }, 
        {
          "display_type": "boost_number", 
          "trait_type": "Aqua Power", 
          "value": 40
        }, 
        {
          "display_type": "boost_percentage", 
          "trait_type": "Stamina Increase", 
          "value": 10
        }, 
        {
          "display_type": "number", 
          "trait_type": "Generation", 
          "value": 2
        }
      ]
    }
  ]; 

  console.log("image: ", items[0].image);
  return (
    <>
    <Carousel interval={null} activeIndex={index} onSelect={handleSelect}>
      {
        items.map((item) => 
          (
            <Carousel.Item>
              <Card>
                <Row className="w-100" style={{}}>
                  <Card.Img className="mw-100" 
                    variant="top" 
                    src={item.image} 
                    style={{objectFit: 'fill', height:'364px'}}
                  />
                </Row>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    { item.description }
                  </Card.Text>
                  <ListGroup>
                      {
                        item.attributes.map((attr,i) => 
                          <ListGroup.Item key={i}>{`${attr.trait_type}: ${attr.value}`}</ListGroup.Item>
                          )
                      }
                  </ListGroup>
                </Card.Body>
              </Card>    
            </Carousel.Item>  
          )
        )
      }
    </Carousel>
    </>
  );

 }
