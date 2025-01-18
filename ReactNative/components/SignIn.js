import React, { useState, useContext } from 'react';
import { Text, TextInput, View, StyleSheet, ActivityIndicator, Pressable, Modal } from 'react-native';
import { signIn, resetPassword } from '../api/SignInUpApi';
import { TokenContext, UsernameContext } from '../Context/Context';

export default function SignIn() {
    const [identifiant, setIdentifiant] = useState(''); 
    const [mdp, setMdp] = useState(''); 
    const [erreur, setErreur] = useState(''); 
    const [chargement, setChargement] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [recoveryIdentifiant, setRecoveryIdentifiant] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [token, setToken] = useContext(TokenContext);
    const [username, setUsername] = useContext(UsernameContext);

    const getSignIn = () => {
        setErreur('');
        if (identifiant === '' || mdp === '') {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        setChargement(true); 
        signIn(identifiant, mdp)
            .then(receivedToken => {
                setUsername(identifiant);
                setToken(receivedToken);
            })
            .catch(err => {
                setErreur(err.message);
            })
            .finally(() => {
                setTimeout(() => {
                    setChargement(false); 
                }, 1000); 
            });
    };

    const handlePasswordReset = () => {
        if (!recoveryIdentifiant || !newPassword) {
            setErreur("Veuillez remplir tous les champs pour réinitialiser le mot de passe.");
            return;
        }

        resetPassword(recoveryIdentifiant, newPassword)
            .then(() => {
                setSuccessMessage("Mot de passe réinitialisé avec succès !");
                setModalVisible(false);
            })
            .catch(err => {
                setErreur("Identifiant non trouvé.");
            });
    };

    return (
        <View style={styles.container}>
            {chargement ? (
                <ActivityIndicator size="large" color="#DAA520" /> 
            ) : (
                <View style={styles.formContainer}>
                    <Text style={styles.instructionText}>Entrez votre Identifiant et Mot de passe</Text>
                    <View style={styles.champContainer}>
                        <Text style={styles.label}>Identifiant :</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setIdentifiant}
                            onSubmitEditing={getSignIn}
                            value={identifiant}
                            placeholder="Entrez votre identifiant"
                            placeholderTextColor="#aaa"
                            />
                    </View>
                    <View style={styles.champContainer}>
                        <Text style={styles.label}>Mot de passe :</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setMdp}
                            secureTextEntry={true}
                            onSubmitEditing={getSignIn}
                            value={mdp}
                            placeholder="Entrez votre mot de passe"
                            placeholderTextColor="#aaa"
                            />
                    </View>
                    <Pressable
                        onPress={getSignIn}
                        style={({ pressed }) => [
                            styles.boutonConnexion,
                            { opacity: pressed ? 0.8 : 1 } 
                        ]}
                    >
                        <Text style={styles.boutonConnexionTexte}>Se connecter</Text>
                    </Pressable>
                    <Pressable onPress={() => setModalVisible(true)}>
                        <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
                    </Pressable>
                    {erreur ? (
                        <Text style={styles.erreurTexte}>{erreur}</Text>
                    ) : null}
                    {successMessage ? (
                        <Text style={styles.successMessage}>{successMessage}</Text>
                    ) : null}
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Réinitialisation du mot de passe</Text>
                        <TextInput
                            style={styles.modalTextInput}
                            onChangeText={setRecoveryIdentifiant}
                            value={recoveryIdentifiant}
                            placeholder="Entrez votre identifiant"
                            placeholderTextColor="#aaa"
                            />
                        <TextInput
                            style={styles.modalTextInput}
                            onChangeText={setNewPassword}
                            secureTextEntry={true}
                            value={newPassword}
                            placeholder="Entrez votre nouveau mot de passe"
                            placeholderTextColor="#aaa"
                            />
                        <Pressable
                            style={styles.boutonRecuperer}
                            onPress={handlePasswordReset}
                        >
                            <Text style={styles.boutonConnexionTexte}>Réinitialiser</Text>
                        </Pressable>
                        <Pressable
                            style={styles.boutonFermer}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.boutonConnexionTexte}>Fermer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: '#FFFFFF', 
        padding: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 1,
        borderColor: '#DAA520', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 10,

    },
    instructionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333', 
        marginBottom: 20,
        textAlign: 'center',
    },
    champContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#333333', 
        marginBottom: 5,
    },
    textInput: {
        backgroundColor: '#FFFFFF', 
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: '#333333', 
        borderWidth: 1,
        borderColor: '#DAA520', 
    },
    boutonConnexion: {
        backgroundColor: '#DAA520', 
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 2,
    },
    boutonConnexionTexte: {
        color: '#FFFFFF', 
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    forgotPassword: {
        marginTop: 10,
        color: '#DAA520', 
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    erreurTexte: {
        color: '#FF7F7F', 
        fontWeight: 'bold', 
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    successMessage: {
        color: '#32CD32', 
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        padding: 20,
    },
    modalView: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: '#DAA520', 
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333', 
        marginBottom: 10,
        textAlign: 'center',
    },
    modalTextInput: {
        backgroundColor: '#FFFFFF', 
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: '#333333', 
        borderWidth: 1,
        borderColor: '#DAA520', 
        marginBottom: 15,
    },
    boutonRecuperer: {
        backgroundColor: '#DAA520', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    boutonFermer: {
        backgroundColor: '#A9A9A9', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
});
