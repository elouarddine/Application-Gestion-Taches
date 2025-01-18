import React, { useState, useContext } from 'react';
import { Text, TextInput, View, StyleSheet, ActivityIndicator, Pressable, Modal } from 'react-native';
import { signUp } from '../api/SignInUpApi'; 
import { TokenContext, UsernameContext } from '../Context/Context';

export default function SignUp() {
    const [identifiant, setIdentifiant] = useState(''); 
    const [mdp, setMdp] = useState(''); 
    const [confirmationMdp, setConfirmationMdp] = useState(''); 
    const [erreur, setErreur] = useState(''); 
    const [chargement, setChargement] = useState(false); 
    const [inscriptionSuccess, setInscriptionSuccess] = useState(false); 
    const [inscriptionMessage, setInscriptionMessage] = useState(''); 

    const [token, setToken] = useContext(TokenContext);
    const [username, setUsername] = useContext(UsernameContext);

    const getSignUp = () => {
        setErreur('');
        setInscriptionSuccess(false); 

        if (identifiant === '' || mdp === '' || confirmationMdp === '') {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }
        if (mdp !== confirmationMdp) {
            setErreur("Les mots de passe ne correspondent pas.");
            return;
        }

        setChargement(true); 
        signUp(identifiant, mdp)
            .then(() => {
                setInscriptionMessage("Inscription réussie. Vous pouvez maintenant vous connecter.");
                setInscriptionSuccess(true); 
                setIdentifiant('');
                setMdp('');
                setConfirmationMdp('');
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

    return (
        <View style={styles.container}>
            {chargement ? (
                <ActivityIndicator size="large" color="#DAA520" />
            ) : (
                <View style={styles.formContainer}>
                    <Text style={styles.instructionText}>Remplissez tous les champs.</Text>
                    <View style={styles.champContainer}>
                        <Text style={styles.label}>Identifiant :</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setIdentifiant}
                            value={identifiant}
                            placeholder="Entrez votre identifiant"
                            placeholderTextColor="#A9A9A9"
                        />
                    </View>
                    <View style={styles.champContainer}>
                        <Text style={styles.label}>Mot de passe :</Text>
                        <TextInput 
                            style={styles.textInput}
                            onChangeText={setMdp}
                            secureTextEntry={true}
                            value={mdp}
                            placeholder="Entrez votre mot de passe"
                            placeholderTextColor="#A9A9A9"
                        />
                    </View>
                    <View style={styles.champContainer}>
                        <Text style={styles.label}>Confirmer le mot de passe :</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setConfirmationMdp}
                            secureTextEntry={true}
                            value={confirmationMdp}
                            placeholder="Confirmez votre mot de passe"
                            placeholderTextColor="#A9A9A9"
                        />
                    </View>
                    <Pressable
                        onPress={getSignUp}
                        style={({ pressed }) => [
                            styles.boutonInscription,
                            { opacity: pressed ? 0.8 : 1 }
                        ]}
                    >
                        <Text style={styles.boutonInscriptionTexte}>S'inscrire</Text>
                    </Pressable>
                    {erreur ? (
                        <Text style={styles.erreurTexte}>{erreur}</Text>
                    ) : (
                        inscriptionSuccess && (
                            <Text style={styles.inscriptionTexte}>{inscriptionMessage}</Text>
                        )
                    )}
                </View>
            )}
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
    boutonInscription: {
        backgroundColor: '#DAA520',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    boutonInscriptionTexte: {
        color: '#FFFFFF', 
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    erreurTexte: {
        color: '#FF7F7F',
        fontWeight: 'bold', 
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    inscriptionTexte: {
        color: '#32CD32', 
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
});
