import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import {
  View,
  HeightUnit,
  WidthUnit,
  ScreenWidth,
} from './components';

import Icon from 'react-native-vector-icons/FontAwesome';
import io from 'socket.io-client';
import RNFetchBlob from 'react-native-fetch-blob';

@connect(
  ({ fs: { folder } }) => ({
    folder
  }), (dispatch) => ({
    dispatch,
  })
)
export default class DownloadScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      url: 'https://www.youtube.com/watch?v=fgJXC5XbiS8',
      log: [],
      thumbnail: '',
      title: '',
      size: 0,
      data: 0,
      file: '',
      loading: false,
      connected: false,
    };

  }

  componentDidMount() {
    this.socket = io('http://192.168.1.15:3000');

    this.socket.on('connect', () => {
      this.setState({ connected: true });
    });

    this.socket.on('disconnect', () => {
      this.setState({ connected: false });
    });

    this.socket.on('info', (info) => {
      const {
        title,
        thumbnail,
        size,
      } = info;

      this.log('info:', info);

      const { folder } = this.props;
      const file = folder + '/' + title + '.mp3';

      this.setState({
        title,
        thumbnail,
        size,
        file,
        loading: false,
      });

      RNFetchBlob.fs.createFile(file, '', 'base64')
        .catch(e => this.log(e.toString()));

    });

    this.socket.on('data', chunk => {
      let { data } = this.state;
      data += chunk.length;

      this.setState({ data });

      const { file } = this.state;

      RNFetchBlob.fs.writeStream(
        file,
        'base64',
        true
      )
        .then((ofstream) => {
          ofstream.write(chunk.data);
          ofstream.close();
        });
    });

  }

  log(info) {
    let { log } = this.state;
    log = [...log, info];

    console.log(info);
    this.setState({ log });
  }

  download() {
    this.setState({ loading: true });

    const { url } = this.state;

    this.socket.emit('download', url);
  }

  status() {
    const {
      size,
      data,
    } = this.state;

    if (size === 0)
      return null;

    if (data === 0)
      return null;

    if (data !== size) {
      const percentage = ( data/size * 100).toFixed(2);
      return (
        <Text>
          Descargando: {percentage}%
        </Text>
      );
    } else {
      return (
        <Text>
          Descarga exitosa.
        </Text>
      );
    }

  }

  renderDownloadButton() {
    const { loading } = this.state;

    if (!loading) {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.download()}
          >
          <Icon
            color="rgba(49,49,49,0.7)"
            name="download"
            size={20}>
          </Icon>
          <Text style={styles.buttonText}>
            Descargar
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <ActivityIndicator
          size="large"
          color="red"
          ></ActivityIndicator>
      );
    }

  }

  connectionStatus() {
    const { connected } = this.state;
    const status = connected? 'connected': 'disconnected';
    const color = connected? '#00ff00': 'red';

    return (
      <View style={styles.bottom}>
        <Icon
          color={color}
          name="circle"
          size={15}>
        </Icon>
        <Text style={styles.buttonText}>
          {status}
        </Text>
      </View>
    );

  }

  render() {
    const {
      url,
      title,
    } = this.state;

    let { thumbnail } = this.state;
    thumbnail = thumbnail || 'http://www.freeiconspng.com/uploads/classic-youtube-icon--2.png';

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.right}
          onPress={() => this.props.navigation.navigate('FolderSelection')}
          >
          <Icon
            color="rgba(49,49,49,0.7)"
            name="gear"
            size={20}>
          </Icon>
        </TouchableOpacity>
        <Image
          style={styles.thumbnail}
          source={{uri: thumbnail}}
          >
        </Image>
        <Text>
          {title}
        </Text>
        <TextInput
          value={url}
          onChangeText={url => this.setState({url})}
          style={styles.textInput}
          underlineColorAndroid="transparent"
          placeholder="URL..."
          >
        </TextInput>
        {this.renderDownloadButton()}
        {this.status()}
        {this.connectionStatus()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    alignSelf: 'flex-end',
    padding: 30*HeightUnit,
  },
  thumbnail: {
    width: ScreenWidth*0.5,
    height: ScreenWidth*0.5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    width: ScreenWidth*0.9,
    marginVertical: 50*HeightUnit,
  },
  button: {
    flexDirection: 'row',
  },
  buttonText: {
    paddingLeft: 10*WidthUnit,
    color: "rgba(49,49,49,0.9)"
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    padding: ScreenWidth*0.03,
  }
});
