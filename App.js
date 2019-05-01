/** @format */

import React from 'react';
import {
  AppRegistry,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

export default class App extends React.Component {
  state = {
    avatarSource: null,
  };

  constructor(props) {
    super(props);

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  removeBackground = () => {
    const data = this.state.avatarSource
    console.log(data);
    const formData = new FormData();
    formData.append('photo', {
      uri: this.state.avatarSource.uri,
      type: 'image/png',
      name: 'photo'
    });

    formData.append('size', 'auto');

    return fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-API-Key': ""
      },
      body: formData
    }).then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          let message = text
          try {
            const json = JSON.parse(message)
            if (json && json.errors && json.errors[0]) {
              message = json.errors[0].title
            }
          } catch (err) { }
          throw new Error(message)
        })
      }
      return res.blob()
    })
      .then(nsdata => {
        this.setState({
          avatarSource: nsdata
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
              { marginBottom: 20 },
            ]}
          >
            {this.state.avatarSource === null ? (
              <Text>Select a Photo</Text>
            ) : (
                <Image style={styles.avatar} source={this.state.avatarSource} />
              )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.removeBackground}>
          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
              { marginBottom: 20 },
            ]}
          >
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
});