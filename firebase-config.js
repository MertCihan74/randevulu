// Firebase yapılandırması
// Bu dosyayı kullanmadan önce Firebase Console'dan gerçek config değerlerini alın

const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "your-app-id"
};

// Firebase'i başlat
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, push, update, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Randevu işlemleri için fonksiyonlar
export function saveAppointmentToFirebase(appointment) {
    const appointmentsRef = ref(database, 'appointments');
    const newAppointmentRef = push(appointmentsRef);
    return set(newAppointmentRef, {
        ...appointment,
        id: newAppointmentRef.key,
        createdAt: new Date().toISOString(),
        status: 'pending'
    });
}

export function getAppointmentsFromFirebase() {
    const appointmentsRef = ref(database, 'appointments');
    return get(appointmentsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.values(data);
        }
        return [];
    });
}

export function updateAppointmentStatusInFirebase(appointmentId, status) {
    const appointmentRef = ref(database, `appointments/${appointmentId}`);
    return update(appointmentRef, {
        status: status,
        updatedAt: new Date().toISOString()
    });
}

export function deleteAppointmentFromFirebase(appointmentId) {
    const appointmentRef = ref(database, `appointments/${appointmentId}`);
    return remove(appointmentRef);
}

// Hizmet yönetimi
export function saveServiceToFirebase(service) {
    const servicesRef = ref(database, 'services');
    const newServiceRef = push(servicesRef);
    return set(newServiceRef, {
        ...service,
        id: newServiceRef.key,
        createdAt: new Date().toISOString()
    });
}

export function getServicesFromFirebase() {
    const servicesRef = ref(database, 'services');
    return get(servicesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.values(data);
        }
        return [];
    });
}

export function updateServiceInFirebase(serviceId, serviceData) {
    const serviceRef = ref(database, `services/${serviceId}`);
    return update(serviceRef, {
        ...serviceData,
        updatedAt: new Date().toISOString()
    });
}

// Müşteri yönetimi
export function saveCustomerToFirebase(customer) {
    const customersRef = ref(database, 'customers');
    const newCustomerRef = push(customersRef);
    return set(newCustomerRef, {
        ...customer,
        id: newCustomerRef.key,
        createdAt: new Date().toISOString(),
        totalAppointments: 0
    });
}

export function getCustomersFromFirebase() {
    const customersRef = ref(database, 'customers');
    return get(customersRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.values(data);
        }
        return [];
    });
}

// Admin giriş/çıkış
export function signInAdmin(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function signOutAdmin() {
    return signOut(auth);
}

export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// Firebase veritabanı kuralları (firestore.rules dosyasına eklenecek):
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Randevular - herkes okuyabilir, sadece admin yazabilir
    match /appointments/{appointment} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@studioelif.com';
    }

    // Hizmetler - sadece admin
    match /services/{service} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@studioelif.com';
    }

    // Müşteriler - sadece admin
    match /customers/{customer} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@studioelif.com';
    }
  }
}
*/
