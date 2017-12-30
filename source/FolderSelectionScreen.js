import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';

import {
  selectFolder
} from './actions';

import {
  HeightUnit,
  WidthUnit,
  View,
  ScreenWidth,
} from './components';

import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome';

@connect(
  ({ fs: { folder } }) => ({
    folder
  }), (dispatch) => ({
    dispatch,
  })
)
export default class FolderSelectionScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      folderStack: [],
      currentFolder: '/',
      subFolders: [],
    };

    this.selectFolder = this.selectFolder.bind(this);
  }

  selectFolder() {
    const { dispatch } = this.props;

    dispatch(selectFolder(this.state.currentFolder));
    dispatch({type: 'Navigation/BACK',});
  }

  componentDidMount() {
    const { folder, dispatch } = this.props;
    RNFS.readDir('/').
      then(children => {
        const subFolders = children.filter(child => {
          return child.isDirectory() === true;
        });
        this.setState({subFolders});
      })
      .catch(e => console.log(e));
  }

  cd(path) {
    if (path) {
      RNFS.readDir(path).
        then(children => {
          const subFolders = children.filter(child => {
            return child.isDirectory() === true;
          });

          let { folderStack, currentFolder } = this.state;

          folderStack.push(currentFolder);
          currentFolder = path;

          console.log(currentFolder, folderStack);
          this.setState({
            folderStack,
            currentFolder,
          });

          this.setState({subFolders});
        })
        .catch(e => {
          console.log(e);
          ToastAndroid.show('No se puede acceder a esta carpeta.', ToastAndroid.SHORT);
        });
    } else {
      let { folderStack, currentFolder } = this.state;

      currentFolder = folderStack.pop();

      this.setState({
        folderStack,
        currentFolder,
      });

      RNFS.readDir(currentFolder).
        then(children => {
          const subFolders = children.filter(child => {
            return child.isDirectory() === true;
          });

          this.setState({subFolders});
        })
        .catch(e => console.log(e));
    }
  }

  renderBackButton() {
    const { currentFolder } = this.state;

    if (currentFolder === '/')
      return null;
    else
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.cd()}
          >
          <Icon
            style={{
              transform: [{ rotate: '180deg' }]
            }}
            color="rgba(49,49,49,0.7)"
            name="level-down"
            size={20}>
          </Icon>
          <Text style={styles.buttonText}>
            Regresar
          </Text>
        </TouchableOpacity>
      );
  }

  renderFolders() {
    const { subFolders } = this.state;

    return subFolders.map(folder => {
      const {
        path,
        name,
      } = folder;
      return (
        <TouchableOpacity
          style={styles.folderContainer}
          onPress={() => this.cd(path)}
          key={path}>
          <Icon
            color="rgba(49,49,49,0.7)"
            name="folder"
            size={20}>
          </Icon>
          <Text
            style={styles.folderText}>
            {name}
          </Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.currentFolderContainer}>
          <Text style={styles.currentFolder}>
            Carpeta actual: {this.state.currentFolder}
          </Text>
        </View>
        <ScrollView>
          {this.renderFolders()}
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            {this.renderBackButton()}
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.selectFolder}>
              <Text style={styles.buttonText}>
                Seleccionar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  currentFolderContainer: {
    alignItems: 'center',
  },
  currentFolder: {
    fontWeight: 'bold',
    color: '#494949',
  },
  folderContainer: {
    flexDirection: 'row',
    height: 70*HeightUnit,
    paddingLeft: 20*WidthUnit,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  folderText: {
    paddingLeft: 10*WidthUnit,
    color: 'rgba(49,49,49,0.7)',
  },
  buttonsContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenWidth/2,
  },
  buttonText: {
    paddingLeft: 10*WidthUnit,
    color: "rgba(49,49,49,0.9)"
  },
});
