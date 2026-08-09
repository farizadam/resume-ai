import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 12,
  }
});

export const ResumeTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Resume</Text>
        <Text style={styles.body}>{JSON.stringify(data, null, 2)}</Text>
      </View>
    </Page>
  </Document>
);
