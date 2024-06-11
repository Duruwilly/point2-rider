import React, { Dispatch, SetStateAction } from 'react'
import Layout from '../../../layouts/layout'
import { StyleSheet, Text } from 'react-native'
import { colors } from '../../../constants/colors'

const PrivacyPolicy = ({setPages}: {setPages: Dispatch<SetStateAction<number>>}) => {
  return (
    <Layout>
      <Layout.Header back={() => setPages(0)} />
      <Text style={[styles.headerText, { padding: 20 }]}>Privacy</Text>
      <Layout.ScrollView>
        
      </Layout.ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
    headerText: {
      color: colors.darkGrey,
      fontWeight: "bold",
      fontSize: 24,
      // textAlign: "center",
    },
  });

export default PrivacyPolicy