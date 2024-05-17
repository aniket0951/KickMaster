import React from 'react'
import { SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native'

function ProfileScreen() {
  return (
    <>
      <SafeAreaView style={style.container}>
        <ScrollView style={style.scrollView}>
          
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    height: '100%',
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // marginTop:10,
    backgroundColor: '#e4e5f1'
  },
  card_container: {
    width: '100%',
    marginTop: 15

  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black'
  },

  card_title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },

  login_btn: {
    backgroundColor: '#484b6a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },

  new_admission: {
    textAlign: 'right',
    color: 'blue',
    padding: 5,
    fontSize: 15,
    fontWeight: 'bold'
  },
  picker: {
    height: 50,
    width: '80%',
    backgroundColor: '#e4e5f1',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  scrollView: {
    width: '95%',
    backgroundColor: '#e4e5f1'
  },
})


export default ProfileScreen