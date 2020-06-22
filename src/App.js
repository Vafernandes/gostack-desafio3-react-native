import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, [])

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`)
    const findRepoByIndex = repositories.findIndex(repo => repo.id === id)
    repositories[findRepoByIndex] = response.data;
    setRepositories([...repositories]);
  }

  async function handleDeslikeRepository(id) {
    const response = await api.post(`repositories/${id}/deslike`);
    const findReposiotyIndex = repositories.findIndex(repository => repository.id === id);
    repositories[findReposiotyIndex] = response.data;
    setRepositories([...repositories]);
  }

  async function handleDelete(id) {
    await api.delete(`repositories/${id}`)
    const newRepository = repositories.filter(repository => repository.id !== id);
    setRepositories(newRepository);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {tech}
                  </Text>))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtida{repository.likes > 1 && <>s</>}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonTextLike}>Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDeslikeRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  // testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonTextDelike}>Delike</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleDelete(repository.id)}
                >
                  <Text style={styles.buttonTextDelete}>Deletar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  button: {
    marginTop: 10,
  },
  buttonTextLike: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonTextDelete: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#e02041",
    padding: 15,
  },
  buttonTextDelike: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#ec3",
    padding: 15,
  }
});
