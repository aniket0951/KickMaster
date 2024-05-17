import React, { useEffect, useState } from 'react'
import {
  StyleSheet, TouchableOpacity, View, TextInput, Text, ActivityIndicator, ScrollView, SafeAreaView, ToastAndroid,
  Image
} from 'react-native'
import { Avatar, Button, Card, Icon, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faL, faTreeCity } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { ENDPOINTS, addLocalData, generateGuestToken, getData, isEmpty, showToast } from './helper/endpoints';
import ImagePicker from 'react-native-image-picker';
import { Headers } from './helper/endpoints';
import { storeData } from '../utils/notification';
import { color } from 'react-native-elements/dist/helpers';

function LoginScreen({ navigation }) {
  const [text, setText] = useState('');
  const [isRegistration, setIsRegistration] = useState(false);
  const [isParentView, setIsParentView] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [weight, setWeight] = useState(0);
  const [schoolName, setSchoolName] = useState('');
  const [gender, setgender] = useState('');
  const [adharNumber, setAdharNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [parentMobile, setparentMobile] = useState(0);
  const [studentRegistrationId, setStudentRegistrationId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isRegistrationUnderReview, setIsRegistrationUnderReview] = useState(false)

  useEffect(() => {
    checkRegistrationProgress();
  }, [])

  const checkRegistrationProgress = () => {
    getData("isLogin").then(isLogin => {
      if (isLogin === 'true') {
        navigation.navigate('HomeScreen');
      }
    })
    getData("isParentPending").then(async (pending) => {
      if (pending === 'true') {
        console.log("View Open by this 3");

        setIsRegistration(false)
        setIsParentView(true)
      } else if (pending === null) {
        // check for registration Id
        getData("registrationId").then(async (registrationID) => {
          if (registrationID) {
        console.log("View Open by this 1");

            setIsRegistration(false)
            setIsParentView(true)
          } else {
        console.log("View Open by this 2");

            setIsRegistration(false)
            setIsParentView(false)
          }
        });
      } else {
        console.log("View Open by this");
        setIsParentView(true)
        setIsRegistrationUnderReview(true)
        setIsRegistration(false)
      }
    })

  }

  const handleChangeText = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    let formattedText = '';
    for (let i = 0; i < numericText.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedText += '-';
      }
      formattedText += numericText[i];
    }
    formattedText = formattedText.substring(0, 14);
    setAdharNumber(formattedText);
  };

  const handleEmailText = (text) => {
    setParentEmail(text);
    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(text);
    setIsValidEmail(isValid);
  };

  const handleInputChange = (inputText) => {
    setText(inputText);
  };

  const login = () => {
    if (text === "") {
      showToast("Enter the student id")
      return
    }
   
    axios
      .get(ENDPOINTS.STUDENT_LOGIN + text, { headers: Headers("") })
      .then(response => {
        if (response) {
          showToast(response.data.message)
          storeData("access_token", response.data.data.access_token)
          storeData("isLogin", "true")
          
          navigation.navigate('HomeScreen');

        }

      })
      .catch(error => {
        showToast("failed to login ", error)
      })

  }

  const addParent = () => {
    setLoading(true)

    if (isEmpty(parentName) && isEmpty(parentAddress) && isEmpty(parentMobile)) {
      showToast("Please enter the details")
      setLoading(false)
      return
    }


    const int_mobile = parseInt(parentMobile)
    getData("registrationId").then(async (studentId) => {
      if (studentId) {
        setStudentRegistrationId(studentId)
        getData("guest_token").then(async (token) => {
          console.log("Guest token :", token);
          setAccessToken(token)
          return token
        })
      }
      setStudentRegistrationId(studentId)
      return studentId
    })

    const requestObj = {
      "student_id": studentRegistrationId,
      "name": parentName,
      "address": parentAddress,
      "mobile_number": int_mobile,
      "email": parentEmail
    }

    const headers = Headers(accessToken);

    axios
      .post(ENDPOINTS.ADD_PARENT, requestObj, { headers: headers })
      .then(response => {
        if (response) {
          console.log("Response : ", response.data);
          showToast(response.data.message)
          storeData("isParentPending", "false")
        }
      })
      .catch(error => {
        console.log("Error : ", error);
        showToast("Failed to add parent ")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const addStudent = () => {
    setLoading(true)
    const int_age = parseInt(age);
    const int_weight = parseInt(weight)
    const requestObj = {
      "name": name,
      "age": int_age,
      "dob": dob,
      "address": address,
      "level": "OffWhite",
      "blood_group": bloodGroup,
      "weight": int_weight,
      "school_name": schoolName,
      "addhar_number": adharNumber,
      "geneder": gender
    };

    if (token === "") {
      getData("guest_token").then(async (token) => {
        setAccessToken(token)
        return token
      })
    }


    const headers = Headers(accessToken);


    axios.post(ENDPOINTS.ADD_STUDENT, requestObj, { headers: headers })
      .then(response => {
        if (response) {
          addLocalData("registrationId", response.data.data)
          addLocalData("isParentPending", 'true')
          setIsParentView(true)
          ToastAndroid.show(response.data.message, ToastAndroid.LONG)
        }
      })
      .catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  const openAdmission = () => {
    setIsRegistration(true)
  }

  const onBack = () => {

    if (isParentView) {
      setIsRegistration(true)
      setIsParentView(false)

    } else if (isRegistration) {
      setIsParentView(false)
      setIsRegistration(false)
    }

    // setIsRegistration(false)
  }

  const RegistrationUnderReview = () => {
    return (
      <View style={style.container}>
        <Text style={{ color: 'black', fontSize: 20, textAlign: 'center' }}> Registration is under review </Text>
      </View>
    )
  }


  const ParentRegistrationView = () => {
    return (
      <>
        {
          isRegistrationUnderReview ? RegistrationUnderReview() :
            <SafeAreaView style={style.container}>
              <ScrollView style={style.scrollView}>
                <View >
                  <Card style={style.card_container}>
                    <Card.Title titleStyle={style.card_title} title="Add Parent Information"
                      left={(props) => (
                        <IconButton
                          {...props}
                          icon={() => <FontAwesomeIcon icon={faArrowLeft} size={15} style={{ marginLeft: -15 }} color="black" />}
                          onPress={() => onBack()}
                        />
                      )}
                    />
                    <Card.Content>
                      <TextInput
                        style={style.input}
                        placeholder="Enter name"
                        value={parentName}
                        onChangeText={setParentName}
                        placeholderTextColor="black"
                      />
                      <TextInput
                        style={style.input}
                        placeholder="Enter address"
                        value={parentAddress}
                        onChangeText={setParentAddress}
                        placeholderTextColor="black"

                      />
                      <TextInput
                        style={style.input}
                        placeholder="Enter mobile number"
                        value={parentMobile}
                        onChangeText={setparentMobile}
                        keyboardType="numeric"
                        placeholderTextColor="black"
                      />

                      <TextInput
                        style={[style.input, !isValidEmail && style.inputError]}
                        placeholder="Enter email"
                        value={parentEmail}
                        keyboardType='email-address'
                        onChangeText={handleEmailText}
                        placeholderTextColor="black"
                      />
                    </Card.Content>
                    <Card.Actions>

                      <TouchableOpacity
                        style={style.login_btn}
                        onPress={addParent}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={style.text}>
                            Save & Next
                          </Text>
                        )}

                      </TouchableOpacity>
                    </Card.Actions>
                  </Card>
                </View>
              </ScrollView>
            </SafeAreaView>
        }

      </>

    )
  }

  const registrationView = () => {
    return (
      <>
        {
          isParentView ? ParentRegistrationView() :
            <SafeAreaView style={style.container}>
              <ScrollView style={style.scrollView} >
                <View >
                  <Card style={style.card_container}>
                    <Card.Title title="Add Student Information" titleStyle={style.card_title}
                      left={(props) => (
                        <IconButton
                          {...props}
                          icon={() => <FontAwesomeIcon icon={faArrowLeft} size={15} style={{ marginLeft: -15 }} color="black" />}
                          onPress={() => onBack()}
                        />
                      )}
                    />
                    <Card.Content>
                      <TextInput
                        style={style.input}
                        placeholder="Enter Name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="black"
                      />
                      <TextInput
                        style={style.input}
                        placeholder="Enter Age"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        placeholderTextColor="black"

                      />
                      <TextInput
                        style={style.input}
                        placeholder="Enter Date of Birth YYYY/MM/DD"
                        value={dob}
                        onChangeText={setDob}
                        placeholderTextColor="black"
                      />

                      <TextInput
                        style={style.input}
                        placeholder="Enter address"
                        value={address}
                        onChangeText={setAddress}
                        placeholderTextColor="black"
                      />

                      <TextInput
                        style={style.input}
                        placeholder="Enter Blood Group"
                        value={bloodGroup}
                        onChangeText={setBloodGroup}
                        placeholderTextColor="black"
                      />
                      <TextInput
                        style={style.input}
                        placeholder="Enter Weight"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                        placeholderTextColor="black"
                      />
                      <TextInput
                        style={style.input}
                        placeholder="Enter School name"
                        value={schoolName}
                        onChangeText={setSchoolName}
                        placeholderTextColor="black"
                      />
                      <TextInput
                        style={style.input}
                        placeholder="Enter Adhar Number"
                        keyboardType="numeric"
                        value={adharNumber}
                        onChangeText={handleChangeText}
                        placeholderTextColor="black"
                      />
                      <Picker
                        style={style.picker}
                        gender={gender}
                        selectedValue={gender}
                        onValueChange={(itemValue, itemIndex) => setgender(itemValue)}
                      >
                        <Picker.Item color='black' label="Select Gender" value={{ gender }} />
                        <Picker.Item color='black' label="Male" value="male" />
                        <Picker.Item color='black' label="FeMale" value="female" />
                      </Picker>
                    </Card.Content>
                    <Card.Actions>
                      <TouchableOpacity
                        style={style.login_btn}
                        onPress={addStudent}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={style.text}>Save & Next</Text>
                        )}
                      </TouchableOpacity>
                    </Card.Actions>
                  </Card>
                </View>
              </ScrollView>
            </SafeAreaView>

        }

      </>
    )
  }

  return (
    <>
      {
        isRegistration ? registrationView() :
          <SafeAreaView style={style.container}>
            <ScrollView style={style.scrollView}>
              <View >
                <Card style={style.card_container}>

                  <Card.Title titleStyle={style.card_title} title="Login" />
                  <Card.Content>
                    <TextInput
                      style={style.input}
                      onChangeText={handleInputChange}
                      value={text}
                      placeholder="Enter student id "
                      placeholderTextColor="black"
                    />
                    <Text style={style.new_admission} onPress={openAdmission} >
                      New Admission
                    </Text>

                  </Card.Content>
                  {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                  <Card.Actions>

                    <TouchableOpacity
                      style={style.login_btn}
                      onPress={login}
                    >
                      <Text style={style.text}>
                        Login
                      </Text>
                    </TouchableOpacity>
                  </Card.Actions>
                </Card>
              </View>
            </ScrollView>
          </SafeAreaView>
      }


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

export default LoginScreen