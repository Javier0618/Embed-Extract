// Import Firebase modules 
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, query, where, orderBy, limit, serverTimestamp, onSnapshot, writeBatch, deleteDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js"; // Añadido deleteDoc

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNeedBwkLS_U0a048mZ233DSM-bMh789U",
  authDomain: "streamfusion-app.firebaseapp.com",
  projectId: "streamfusion-app",
  storageBucket: "streamfusion-app.firebasestorage.app",
  messagingSenderId: "1023470476009",
  appId: "1:1023470476009:web:f398cd8daf7cf55b782e78",
  measurementId: "G-35C7CJHLKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const apiCache = new Map();

const translations = {
    'es-MX': {
        'auth.loginTitle': 'Iniciar Sesión',
        'auth.emailPlaceholder': 'Correo electrónico',
        'auth.passwordPlaceholder': 'Contraseña',
        'auth.loginButton': 'Iniciar Sesión',
        'auth.continueWithGoogle': 'Continuar con Google',
        'auth.noAccount': '¿No tienes una cuenta?',
        'auth.registerLink': 'Regístrate',
        'auth.createAccountTitle': 'Crear Cuenta',
        'auth.fullNamePlaceholder': 'Nombre completo',
        'auth.confirmPasswordPlaceholder': 'Confirmar contraseña',
        'auth.registerButton': 'Registrarse',
        'auth.hasAccount': '¿Ya tienes una cuenta?',
        'auth.loginLink': 'Inicia sesión',
        'nav.home': 'Inicio',
        'nav.movies': 'Películas',
        'nav.series': 'Series',
        'nav.animes': 'Animes',
        'nav.doramas': 'Doramas',
        'nav.tv': 'TV',
        'search.placeholder': 'Buscar títulos...',
        'home.exploreByCategory': 'Explorar por Categoría',
        'home.inTheaters': 'En Estreno/Emisión',
        'home.recentlyAdded': 'Recién Agregado',
        'home.top10': 'TOP 10 más vistos',
        'home.popularMovies': 'Películas populares',
        'home.popularSeries': 'Series populares',
        'home.seeAll': 'Ver todo',
        'page.inTheatersTitle': 'En Estreno',
        'page.moviesTitle': 'Películas',
        'page.seriesTitle': 'Series',
        'page.animesTitle': 'Animes',
        'page.doramasTitle': 'Doramas',
        'page.backButton': 'Volver',
        'page.loadMore': 'Cargar Más',
        'page.genreResultsTitle': 'Resultados por Género',
        'page.searchResultsTitle': 'Resultados de búsqueda',
        'page.statsTitle': 'Estadísticas de Clicks',
        'page.connectedUsersTitle': 'Usuarios Conectados',
        'profile.myProfile': 'Mi Perfil',
        'profile.info': 'Información',
        'profile.myList': 'Mi Lista',
        'profile.messages': 'Mensajes',
        'profile.settings': 'Configuración',
        'profile.userDetails': 'Detalles de Usuario',
        'profile.nameLabel': 'Nombre:',
        'profile.emailLabel': 'Correo:',
        'profile.regDateLabel': 'Fecha de registro:',
        'profile.noMessages': 'No tienes mensajes nuevos',
        'profile.sendMessageToAdmin': 'Enviar mensaje al administrador',
        'profile.messagePlaceholder': 'Escribe tu mensaje aquí...',
        'profile.messageLimitInfo': 'Puedes enviar hasta 2 mensajes por día.',
        'profile.sendMessageButton': 'Enviar mensaje',
        'admin.title': 'Panel de Administrador',
        'admin.usersTab': 'Usuarios',
        'admin.messagesTab': 'Mensajes',
        'admin.registeredUsers': 'Usuarios Registrados',
        'admin.activeUsers': 'Usuarios Activos (Última Hora)',
        'admin.userSearchPlaceholder': 'Buscar usuarios por nombre o correo...',
        'admin.recipientLabel': 'Destinatario:',
        'admin.allUsersOption': 'Todos los usuarios',
        'admin.messageLabel': 'Mensaje:',
        'admin.sendMessageButton': 'Enviar Mensaje',
        'admin.receivedMessages': 'Mensajes Recibidos',
        'admin.noReceivedMessages': 'No hay mensajes recibidos',
        'management.title': 'Gestión de Contenido',
        'management.addContentTab': 'Agregar Contenido',
        'management.manageContentTab': 'Gestionar Contenido',
        'management.addFromTMDb': 'Agregar Contenido desde TMDB',
        'management.searchPlaceholder': 'Buscar película o serie por nombre...',
        'management.searchButton': 'Buscar',
        'management.populateDb': 'Poblar Base de Datos',
        'management.populateDbInfo': 'Usa este botón para agregar una selección curada de contenido popular a la base de datos. Esto es útil para la configuración inicial.',
        'management.populateDbButton': 'Poblar con Contenido Popular',
        'management.manageImported': 'Gestionar Contenido Importado',
        'management.manageSearchPlaceholder': 'Buscar contenido por título...',
        'welcome.title': 'Bienvenido a StreamFusion',
        'welcome.subtitle': 'Tu plataforma de entretenimiento streaming',
        'welcome.intro': 'StreamFusion es una app Gratuita de Entretenimiento Streaming que te permite disfrutar de todo tu contenido favorito en un solo lugar.',
        'welcome.importantTitle': 'IMPORTANTE',
        'welcome.importantText': 'En StreamFusion puedes hacer petición y reportar contenido que ya no este funcionando desde tu perfil o desde el apartado de la pelicula serie dando clic en el icono ❕',
        'welcome.enjoy': 'No siendo más disfruta del contenido. 🎉',
        'welcome.dontShowAgain': 'No mostrar más',
        'welcome.startButton': 'Comenzar a explorar',
        'modal.editUserTitle': 'Editar Usuario',
        'modal.nameLabel': 'Nombre:',
        'modal.emailLabel': 'Correo electrónico:',
        'modal.cancelButton': 'Cancelar',
        'modal.saveButton': 'Guardar',
        'modal.sendMessageTitle': 'Enviar Mensaje',
        'modal.toLabel': 'Para:',
        'modal.messageLabel': 'Mensaje:',
        'modal.sendButton': 'Enviar',
        'modal.deleteConfirmTitle': 'Confirmar Eliminación',
        'modal.deleteUserConfirmText': '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
        'modal.deleteButton': 'Eliminar',
        'modal.deleteMessageConfirmText': '¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer.',
        'modal.importOptionsTitle': 'Opciones de Importación',
        'modal.mainSectionsLabel': 'Secciones Principales (dónde aparecerá el contenido):',
        'modal.moviesSection': 'Películas',
        'modal.seriesSection': 'Series',
        'modal.animesSection': 'Animes',
        'modal.doramasSection': 'Doramas',
        'modal.homeOptionsLabel': 'Opciones de la Página de Inicio:',
        'modal.mainSliderSection': 'Slider Principal',
        'modal.inTheatersSection': 'En Estreno/Emisión',
        'modal.recentlyAddedSection': 'Recién Agregado',
        'modal.platformsLabel': 'Plataformas (si aplica):',
        'modal.importButton': 'Importar',
        'modal.addVideoUrlsTitle': 'Agregar URLs de Video',
        'modal.importCsvButton': 'Importar CSV',
        'modal.saveAndContinueButton': 'Guardar y Continuar',
        'modal.saveLinksButton': 'Guardar Enlaces',
        'modal.deleteContentConfirmTitle': 'Confirmar Eliminación de Contenido',
        'modal.deleteContentConfirmText': '¿Estás seguro de que deseas eliminar este contenido? Esta acción no se puede deshacer.',
        'modal.donationTitle': 'Apoya nuestro proyecto',
        'modal.donationText': 'Tu donación nos ayuda a mantener StreamFusion y seguir ofreciendo contenido de calidad sin costo.',
        'modal.donationBenefit1': 'Ayudas a mantener el servicio sin anuncios',
        'modal.donationBenefit2': 'Contribuyes al desarrollo de nuevas funciones',
        'modal.donationBenefit3': 'Apoyas a nuestro equipo de contenido',
        'modal.donationNote': 'Serás redirigido al sitio seguro de PayPal para completar tu donación.',
        'modal.closeButton': 'Cerrar',
        'modal.acceptButton': 'Aceptar',
        'bottomNav.home': 'Inicio',
        'bottomNav.movies': 'Películas',
        'bottomNav.series': 'Series',
        'bottomNav.animes': 'Animes',
        'bottomNav.tv': 'TV',
        'details.youMightLike': 'También te podría gustar',
        'details.season': 'Temporada',
        'details.noSeasons': 'No se encontraron temporadas.',
        'details.noEpisodes': 'No se encontraron episodios.',
        'details.episode': 'Ep.',
        'details.noDescription': 'No hay descripción disponible.',
        'details.director': 'Director',
        'details.creator': 'Creador',
        'details.cast': 'Reparto',
        'details.year': 'Año',
        'details.genre': 'Género',
        'details.addToMyList': 'Agregar a Mi Lista',
        'details.videoNotAvailable': 'Video no disponible.',
        'user.profile.dropdown.myProfile': 'Mi Perfil',
        'user.profile.dropdown.adminPanel': 'Panel de Admin',
        'user.profile.dropdown.management': 'Gestión',
        'user.profile.dropdown.stats': 'Estadísticas',
        'user.profile.dropdown.connected': 'Conectado',
        'user.profile.dropdown.logout': 'Cerrar Sesión',
        'user.profile.dropdown.login': 'Iniciar Sesión',
        'user.profile.dropdown.register': 'Registrarse',
        'user.profile.welcome': 'Bienvenido',
        'user.profile.restrictedAccess': 'Acceso Restringido',
        'user.profile.loginRequired': 'Debes iniciar sesión o registrarte para acceder a tu perfil.',
        'user.profile.myList.emptyTitle': 'Tu lista está vacía',
        'user.profile.myList.emptyText': 'Añade películas y series para verlas aquí.',
        'user.profile.myList.loadError': 'Error al cargar tu lista.',
        'user.messages.loading': 'Cargando mensajes...',
      	'modal.loading': 'Cargando...',
        'user.messages.loadError': 'Ha ocurrido un error al cargar tus mensajes. Por favor, intenta de nuevo más tarde.',
        'user.messages.sender.admin': 'Administrador',
        'user.messages.sender.you': 'Yo',
        'user.messages.sender.system': 'Sistema',
        'user.messages.delete': 'Eliminar',
        'user.messages.messageLimit.canSend': 'Puedes enviar {count} mensaje(s) más hoy.',
        'user.messages.messageLimit.limitReached': 'Has alcanzado el límite de 2 mensajes por día. Intenta de nuevo mañana.',
        'user.messages.messageLimit.error': 'Error al verificar límite de mensajes. Puedes intentar enviar un mensaje.',
        'user.messages.adminNoLimit': 'Puedes enviar mensajes al administrador.',
        'user.messages.sendError.noMessage': 'Por favor, escribe un mensaje.',
        'user.messages.sendError.general': 'Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.',
        'user.messages.sendSuccess': 'Tu mensaje ha sido enviado correctamente.',
        'user.messages.deleteSuccess': 'Mensaje eliminado correctamente.',
        'user.messages.deleteError': 'Error al eliminar el mensaje. Por favor, intenta de nuevo más tarde.',
        'user.messages.sending': 'Enviando...',
        'user.messages.sendMessage': 'Enviar mensaje',
        'content.type.movie': 'Película',
        'content.type.series': 'Serie',
        'content.noTitle': 'Sin título',
        'content.notAvailable': 'N/A',
        'content.newSticker': 'Nuevo',
        'content.noContent': 'No se encontró contenido para mostrar en esta sección.',
        'content.emptyState.title': 'No hay contenido disponible',
        'content.emptyState.text': 'No se encontró contenido para mostrar en esta sección.',
        'toast.addedToList': 'Agregado a tu lista!',
        'toast.alreadyInList': 'Ya está en tu lista.',
        'toast.addToListError': 'Error al añadir a la lista.',
        'toast.removeFromListError': 'Error al eliminar el elemento de tu lista',
        'genres.genreLabel': 'Género',
        'genres.action': 'Acción',
        'genres.adventure': 'Aventura',
        'genres.animation': 'Animación',
        'genres.comedy': 'Comedia',
        'genres.crime': 'Crimen',
        'genres.documentary': 'Documental',
        'genres.drama': 'Drama',
        'genres.family': 'Familia',
        'genres.fantasy': 'Fantasía',
        'genres.history': 'Historia',
        'genres.horror': 'Terror',
        'genres.music': 'Música',
        'genres.mystery': 'Misterio',
        'genres.romance': 'Romance',
        'genres.science_fiction': 'Ciencia Ficción',
        'genres.tv_movie': 'Película de TV',
        'genres.thriller': 'Suspenso',
        'genres.war': 'Bélica',
        'genres.western': 'Occidental',
        'genres.resultsFor': 'Resultados para',
        'genres.loadError': 'Error al cargar el género.',
        'admin.registeredLabel': 'Registro:',
        'admin.lastActivityLabel': 'Última Actividad:',
        'admin.fromLabel': 'De:',
        'admin.user': 'Usuario',
        'admin.never': 'Nunca',
        'admin.noAccess': 'No tienes permisos para acceder a este panel.',
        'admin.unknownUser': 'Usuario desconocido',
        'admin.statusLabel': 'Estado:',
        'admin.statusConnected': 'Conectado',
        'admin.noUsersFound': 'No se encontraron usuarios.',
        'admin.loadUsersError': 'Error al cargar usuarios.',
        'actions.list': 'Lista',
        'actions.watchNow': 'Ver ahora',
        'actions.info': 'Info',
        'actions.moreInfo': 'Más información',
        'actions.delete': 'Eliminar',
        'actions.edit': 'Editar',
        'actions.message': 'Mensaje',
        'actions.reply': 'Responder',
        'actions.addToList': 'Añadir a mi lista',
        'actions.removeFromList': 'Eliminar de la lista',
        'actions.saving': 'Guardando...',
        'actions.added': 'Agregado',
        'actions.alreadyInList': 'Ya en tu lista',
        'actions.error': 'Error',
        'actions.import': 'Importar',
        'actions.updateUrls': 'Actualizar URLs',
        'actions.next': 'Siguiente',
        'modal.editDisplayOptions': 'Editar Opciones de Visualización',
        'modal.editUrlsTitle': 'Editar URLs para:',
        'modal.addUrlsTitle': 'Agregar URLs para:',
        'modal.videoUrlLabel': 'URL del Video',
        'modal.urlsUpdatedSuccess': 'Las URLs se han actualizado correctamente.',
        'modal.urlsUpdatedError': 'No se pudieron actualizar las URLs.',
        'modal.errorTitle': 'Error',
        'modal.loadUserError': 'Error al cargar los datos del usuario.',
        'modal.validationErrorTitle': 'Error de Validación',
        'modal.validationErrorText': 'Por favor, completa todos los campos.',
        'modal.updateSuccessTitle': 'Actualización Exitosa',
        'modal.updateSuccessText': 'Usuario actualizado correctamente.',
        'modal.updateErrorTitle': 'Error al Actualizar',
        'modal.updateErrorText': 'Error al actualizar el usuario. Por favor, intenta de nuevo más tarde.',
        'modal.deleteUserSuccessTitle': 'Usuario Eliminado',
        'modal.deleteUserSuccessText': 'Usuario eliminado correctamente.',
        'modal.deleteErrorTitle': 'Error al Eliminar',
        'modal.deleteErrorText': 'Error al eliminar el usuario. Por favor, intenta de nuevo más tarde.',
        'modal.deleteContentSuccessTitle': 'Contenido Eliminado',
        'modal.deleteContentSuccessText': 'El contenido se ha eliminado correctamente.',
        'modal.deleteContentErrorTitle': 'Error al Eliminar Contenido',
        'modal.deleteContentErrorText': 'No se pudo eliminar el contenido. Por favor, intenta de nuevo más tarde.',
        'modal.contentNotFound': 'Este contenido no se encuentra en nuestra base de datos.',
        'modal.notAuthorizedTitle': 'No Autorizado',
        'modal.notAuthorizedText': 'No tienes permiso para importar contenido.',
        'modal.duplicateContentTitle': 'Contenido Duplicado',
        'modal.duplicateContentText': 'Esta película o serie ya ha sido importada.',
        'modal.successTitle': 'Éxito',
        'modal.importSuccess': "'{title}' ha sido importado correctamente.",
        'modal.saveOptionsError': 'Ocurrió un error al guardar las opciones.',
        'modal.seedDbConfirm': '¿Estás seguro de que quieres poblar la base de datos? Esto puede sobrescribir datos existentes si los IDs coinciden.',
        'modal.seedDbSuccessTitle': 'Éxito',
        'modal.seedDbSuccessText': 'Se importaron {importedCount} títulos y se omitieron {skippedCount} duplicados.',
        'modal.seedDbError': 'Ocurrió un error al poblar la base de datos.',
        'search.emptyQueryTitle': 'Búsqueda Vacía',
        'search.emptyQueryText': 'Por favor, introduce un término de búsqueda.',
        'search.noResults': 'No se encontraron resultados.',
        'search.resultsFor': 'Resultados para:',
        'tmdb.searchError': 'Error al buscar en TMDB',
        'tmdb.searchErrorTitle': 'Error de Búsqueda',
        'tmdb.searchErrorText': 'No se pudieron obtener los resultados de TMDB.',
        'trending.empty.title': 'No hay tendencias disponibles',
        'trending.empty.text': 'Aún no hay suficientes datos de clics para mostrar tendencias.',
        'hero.movieDescription': 'Una película imperdible que te mantendrá al borde de tu asiento.',
        'hero.seriesDescription': 'Una serie fascinante con personajes inolvidables y una trama adictiva.',
        'donation.elementsNotFound': 'Algunos elementos del modal de donación no se encontraron',
        'csv.importCompleteTitle': 'Importación de CSV Completa',
        'csv.urlsImportedSuccess': 'URLs importadas correctamente.',
        'csv.rowsNotProcessed': 'filas no se pudieron procesar.',
        'csv.readErrorTitle': 'Error de Lectura',
        'csv.readErrorText': 'No se pudo leer el archivo seleccionado.',
        'settings.generalSettings': 'Configuración General',
        'settings.importLanguage': 'Idioma de Importación de Contenido',
        'settings.displayLanguage': 'Idioma de Visualización',
        'settings.heroSlider.title': 'Hero Slider',
        'settings.heroSlider.posterAmount': 'Cantidad de Posters',
        'settings.heroSlider.randomAmount': 'Cantidad de Posters Aleatorios',
        'settings.heroSlider.recentAmount': 'Cantidad de Posters Recientes',
        'settings.categoryVisibility': 'Visibilidad de Categorías',
        'settings.platformVisibility': 'Visibilidad de Plataformas',
        'settings.homepagePosters.title': 'Cantidad de Posters en Secciones de Inicio',
        'settings.homepagePosters.inTheaters': 'En Estreno/Emisión',
        'settings.homepagePosters.recentlyAdded': 'Recién Agregado',
        'settings.homepagePosters.popularMovies': 'Películas Populares',
        'settings.homepagePosters.popularSeries': 'Series Populares',
        'settings.saveButton': 'Guardar Configuración',
        'settings.saveSuccess': 'La configuración se ha guardado correctamente.',
        'settings.saveError': 'No se pudo guardar la configuración.',
    },
    'en-US': {
        'auth.loginTitle': 'Login',
        'auth.emailPlaceholder': 'Email address',
        'auth.passwordPlaceholder': 'Password',
        'auth.loginButton': 'Login',
        'auth.continueWithGoogle': 'Continue with Google',
        'auth.noAccount': "Don't have an account?",
        'auth.registerLink': 'Sign up',
        'auth.createAccountTitle': 'Create Account',
        'auth.fullNamePlaceholder': 'Full name',
        'auth.confirmPasswordPlaceholder': 'Confirm password',
        'auth.registerButton': 'Sign Up',
        'auth.hasAccount': 'Already have an account?',
        'auth.loginLink': 'Log in',
        'nav.home': 'Home',
        'nav.movies': 'Movies',
        'nav.series': 'Series',
        'nav.animes': 'Animes',
        'nav.doramas': 'Doramas',
        'nav.tv': 'TV',
        'search.placeholder': 'Search titles...',
        'home.exploreByCategory': 'Explore by Category',
        'home.inTheaters': 'Now Playing/Airing',
        'home.recentlyAdded': 'Recently Added',
        'home.top10': 'TOP 10 Most Viewed',
        'home.popularMovies': 'Popular Movies',
        'home.popularSeries': 'Popular Series',
        'home.seeAll': 'See all',
        'page.inTheatersTitle': 'Now Playing',
        'page.moviesTitle': 'Movies',
        'page.seriesTitle': 'Series',
        'page.animesTitle': 'Animes',
        'page.doramasTitle': 'Doramas',
        'page.backButton': 'Back',
        'page.loadMore': 'Load More',
        'page.genreResultsTitle': 'Genre Results',
        'page.searchResultsTitle': 'Search results',
        'page.statsTitle': 'Click Statistics',
        'page.connectedUsersTitle': 'Connected Users',
        'profile.myProfile': 'My Profile',
        'profile.info': 'Information',
        'profile.myList': 'My List',
        'profile.messages': 'Messages',
        'profile.settings': 'Settings',
        'profile.userDetails': 'User Details',
        'profile.nameLabel': 'Name:',
        'profile.emailLabel': 'Email:',
        'profile.regDateLabel': 'Registration date:',
        'profile.noMessages': 'You have no new messages',
        'profile.sendMessageToAdmin': 'Send message to administrator',
        'profile.messagePlaceholder': 'Write your message here...',
        'profile.messageLimitInfo': 'You can send up to 2 messages per day.',
        'profile.sendMessageButton': 'Send Message',
        'admin.title': 'Administrator Panel',
        'admin.usersTab': 'Users',
        'admin.messagesTab': 'Messages',
        'admin.registeredUsers': 'Registered Users',
        'admin.activeUsers': 'Active Users (Last Hour)',
        'admin.userSearchPlaceholder': 'Search users by name or email...',
        'admin.recipientLabel': 'Recipient:',
        'admin.allUsersOption': 'All users',
        'admin.messageLabel': 'Message:',
        'admin.sendMessageButton': 'Send Message',
        'admin.receivedMessages': 'Received Messages',
        'admin.noReceivedMessages': 'No messages received',
        'management.title': 'Content Management',
        'management.addContentTab': 'Add Content',
        'management.manageContentTab': 'Manage Content',
        'management.addFromTMDb': 'Add Content from TMDB',
        'management.searchPlaceholder': 'Search movie or series by name...',
        'management.searchButton': 'Search',
        'management.populateDb': 'Populate Database',
        'management.populateDbInfo': 'Use this button to add a curated selection of popular content to the database. This is useful for initial setup.',
        'management.populateDbButton': 'Populate with Popular Content',
        'management.manageImported': 'Manage Imported Content',
        'management.manageSearchPlaceholder': 'Search content by title...',
        'welcome.title': 'Welcome to StreamFusion',
        'welcome.subtitle': 'Your streaming entertainment platform',
        'welcome.intro': 'StreamFusion is a Free Streaming Entertainment App that allows you to enjoy all your favorite content in one place.',
        'welcome.importantTitle': 'IMPORTANT',
        'welcome.importantText': 'In StreamFusion you can request and report content that is no longer working from your profile or from the movie/series section by clicking on the ❕ icon',
        'welcome.enjoy': 'That being said, enjoy the content. 🎉',
        'welcome.dontShowAgain': "Don't show again",
        'welcome.startButton': 'Start exploring',
        'modal.editUserTitle': 'Edit User',
        'modal.nameLabel': 'Name:',
        'modal.emailLabel': 'Email address:',
        'modal.cancelButton': 'Cancel',
        'modal.saveButton': 'Save',
        'modal.sendMessageTitle': 'Send Message',
        'modal.toLabel': 'To:',
        'modal.messageLabel': 'Message:',
        'modal.sendButton': 'Send',
        'modal.deleteConfirmTitle': 'Confirm Deletion',
        'modal.deleteUserConfirmText': 'Are you sure you want to delete this user? This action cannot be undone.',
        'modal.deleteButton': 'Delete',
        'modal.deleteMessageConfirmText': 'Are you sure you want to delete this message? This action cannot be undone.',
        'modal.importOptionsTitle': 'Import Options',
        'modal.mainSectionsLabel': 'Main Sections (where the content will appear):',
        'modal.moviesSection': 'Movies',
        'modal.seriesSection': 'Series',
        'modal.animesSection': 'Animes',
        'modal.doramasSection': 'Doramas',
        'modal.homeOptionsLabel': 'Home Page Options:',
        'modal.mainSliderSection': 'Main Slider',
        'modal.inTheatersSection': 'Now Playing/Airing',
        'modal.recentlyAddedSection': 'Recently Added',
        'modal.platformsLabel': 'Platforms (if applicable):',
        'modal.importButton': 'Import',
        'modal.addVideoUrlsTitle': 'Add Video URLs',
        'modal.importCsvButton': 'Import CSV',
        'modal.saveAndContinueButton': 'Save and Continue',
        'modal.saveLinksButton': 'Save Links',
        'modal.deleteContentConfirmTitle': 'Confirm Content Deletion',
        'modal.deleteContentConfirmText': 'Are you sure you want to delete this content? This action cannot be undone.',
        'modal.donationTitle': 'Support our project',
        'modal.donationText': 'Your donation helps us maintain StreamFusion and continue to offer quality content at no cost.',
        'modal.donationBenefit1': 'You help keep the service ad-free',
        'modal.donationBenefit2': 'You contribute to the development of new features',
        'modal.donationBenefit3': 'You support our content team',
        'modal.donationNote': 'You will be redirected to the secure PayPal site to complete your donation.',
        'modal.closeButton': 'Close',
        'modal.acceptButton': 'Accept',
        'bottomNav.home': 'Home',
        'bottomNav.movies': 'Movies',
        'bottomNav.series': 'Series',
        'bottomNav.animes': 'Animes',
        'bottomNav.tv': 'TV',
        'details.youMightLike': 'You might also like',
        'details.season': 'Season',
        'details.noSeasons': 'No seasons found.',
        'details.noEpisodes': 'No episodes found.',
        'details.episode': 'Ep.',
        'details.noDescription': 'No description available.',
        'details.director': 'Director',
        'details.creator': 'Creator',
        'details.cast': 'Cast',
        'details.year': 'Year',
        'details.genre': 'Genre',
        'details.addToMyList': 'Add to My List',
        'details.videoNotAvailable': 'Video not available.',
        'user.profile.dropdown.myProfile': 'My Profile',
        'user.profile.dropdown.adminPanel': 'Admin Panel',
        'user.profile.dropdown.management': 'Management',
        'user.profile.dropdown.stats': 'Statistics',
        'user.profile.dropdown.connected': 'Connected',
        'user.profile.dropdown.logout': 'Logout',
        'user.profile.dropdown.login': 'Login',
        'user.profile.dropdown.register': 'Sign Up',
        'user.profile.welcome': 'Welcome',
        'user.profile.restrictedAccess': 'Restricted Access',
        'user.profile.loginRequired': 'You must log in or register to access your profile.',
        'user.profile.myList.emptyTitle': 'Your list is empty',
        'user.profile.myList.emptyText': 'Add movies and series to see them here.',
        'user.profile.myList.loadError': 'Error loading your list.',
        'user.messages.loading': 'Loading messages...',
      	'modal.loading': 'Cargando...',
        'user.messages.loadError': 'An error occurred while loading your messages. Please try again later.',
        'user.messages.sender.admin': 'Administrator',
        'user.messages.sender.you': 'You',
        'user.messages.sender.system': 'System',
        'user.messages.delete': 'Delete',
        'user.messages.messageLimit.canSend': 'You can send {count} more message(s) today.',
        'user.messages.messageLimit.limitReached': 'You have reached the limit of 2 messages per day. Try again tomorrow.',
        'user.messages.messageLimit.error': 'Error checking message limit. You can try sending a message.',
        'user.messages.adminNoLimit': 'You can send messages to the administrator.',
        'user.messages.sendError.noMessage': 'Please write a message.',
        'user.messages.sendError.general': 'Error sending message. Please try again later.',
        'user.messages.sendSuccess': 'Your message has been sent successfully.',
        'user.messages.deleteSuccess': 'Message deleted successfully.',
        'user.messages.deleteError': 'Error deleting message. Please try again later.',
        'user.messages.sending': 'Sending...',
        'user.messages.sendMessage': 'Send Message',
        'content.type.movie': 'Movie',
        'content.type.series': 'Series',
        'content.noTitle': 'No title',
        'content.notAvailable': 'N/A',
        'content.newSticker': 'New',
        'content.noContent': 'No content found to display in this section.',
        'content.emptyState.title': 'No content available',
        'content.emptyState.text': 'No content found to display in this section.',
        'toast.addedToList': 'Added to your list!',
        'toast.alreadyInList': 'Already in your list.',
        'toast.addToListError': 'Error adding to list.',
        'toast.removeFromListError': 'Error removing item from your list',
        'genres.genreLabel': 'Genre',
        'genres.action': 'Action',
        'genres.adventure': 'Adventure',
        'genres.animation': 'Animation',
        'genres.comedy': 'Comedy',
        'genres.crime': 'Crime',
        'genres.documentary': 'Documentary',
        'genres.drama': 'Drama',
        'genres.family': 'Family',
        'genres.fantasy': 'Fantasy',
        'genres.history': 'History',
        'genres.horror': 'Horror',
        'genres.music': 'Music',
        'genres.mystery': 'Mystery',
        'genres.romance': 'Romance',
        'genres.science_fiction': 'Science Fiction',
        'genres.tv_movie': 'TV Movie',
        'genres.thriller': 'Thriller',
        'genres.war': 'War',
        'genres.western': 'Western',
        'genres.resultsFor': 'Results for',
        'genres.loadError': 'Error loading genre.',
        'genres.genreLabel': 'Genre',
        'admin.registeredLabel': 'Registered:',
        'admin.lastActivityLabel': 'Last Activity:',
        'admin.fromLabel': 'From:',
        'admin.user': 'User',
        'admin.never': 'Never',
        'admin.noAccess': 'You do not have permission to access this panel.',
        'admin.unknownUser': 'Unknown user',
        'admin.statusLabel': 'Status:',
        'admin.statusConnected': 'Connected',
        'admin.noUsersFound': 'No users found.',
        'admin.loadUsersError': 'Error loading users.',
        'actions.list': 'List',
        'actions.watchNow': 'Watch Now',
        'actions.info': 'Info',
        'actions.moreInfo': 'More Info',
        'actions.delete': 'Delete',
        'actions.edit': 'Edit',
        'actions.message': 'Message',
        'actions.reply': 'Reply',
        'actions.addToList': 'Add to My List',
        'actions.removeFromList': 'Remove from list',
        'actions.saving': 'Saving...',
        'actions.added': 'Added',
        'actions.alreadyInList': 'Already in list',
        'actions.error': 'Error',
        'actions.import': 'Import',
        'actions.updateUrls': 'Update URLs',
        'actions.next': 'Next',
        'modal.editDisplayOptions': 'Edit Display Options',
        'modal.editUrlsTitle': 'Edit URLs for:',
        'modal.addUrlsTitle': 'Add URLs for:',
        'modal.videoUrlLabel': 'Video URL',
        'modal.urlsUpdatedSuccess': 'URLs have been updated successfully.',
        'modal.urlsUpdatedError': 'Could not update URLs.',
        'modal.errorTitle': 'Error',
        'modal.loadUserError': 'Error loading user data.',
        'modal.validationErrorTitle': 'Validation Error',
        'modal.validationErrorText': 'Please fill out all fields.',
        'modal.updateSuccessTitle': 'Update Successful',
        'modal.updateSuccessText': 'User updated successfully.',
        'modal.updateErrorTitle': 'Update Error',
        'modal.updateErrorText': 'Error updating user. Please try again later.',
        'modal.deleteUserSuccessTitle': 'User Deleted',
        'modal.deleteUserSuccessText': 'User deleted successfully.',
        'modal.deleteErrorTitle': 'Deletion Error',
        'modal.deleteErrorText': 'Error deleting user. Please try again later.',
        'modal.deleteContentSuccessTitle': 'Content Deleted',
        'modal.deleteContentSuccessText': 'The content has been deleted successfully.',
        'modal.deleteContentErrorTitle': 'Error Deleting Content',
        'modal.deleteContentErrorText': 'Could not delete the content. Please try again later.',
        'modal.contentNotFound': 'This content is not in our database.',
        'modal.notAuthorizedTitle': 'Not Authorized',
        'modal.notAuthorizedText': 'You do not have permission to import content.',
        'modal.duplicateContentTitle': 'Duplicate Content',
        'modal.duplicateContentText': 'This movie or series has already been imported.',
        'modal.successTitle': 'Success',
        'modal.importSuccess': "'{title}' has been imported successfully.",
        'modal.saveOptionsError': 'An error occurred while saving the options.',
        'modal.seedDbConfirm': 'Are you sure you want to populate the database? This may overwrite existing data if IDs match.',
        'modal.seedDbSuccessTitle': 'Success',
        'modal.seedDbSuccessText': '{importedCount} titles were imported and {skippedCount} duplicates were skipped.',
        'modal.seedDbError': 'An error occurred while populating the database.',
        'search.emptyQueryTitle': 'Empty Search',
        'search.emptyQueryText': 'Please enter a search term.',
        'search.noResults': 'No results found.',
        'search.resultsFor': 'Results for:',
        'tmdb.searchError': 'Error searching TMDB',
        'tmdb.searchErrorTitle': 'Search Error',
        'tmdb.searchErrorText': 'Could not retrieve results from TMDB.',
        'trending.empty.title': 'No trends available',
        'trending.empty.text': 'There is not enough click data to show trends yet.',
        'hero.movieDescription': 'A must-see movie that will keep you on the edge of your seat.',
        'hero.seriesDescription': 'A fascinating series with unforgettable characters and an addictive plot.',
        'donation.elementsNotFound': 'Some donation modal elements were not found',
        'csv.importCompleteTitle': 'CSV Import Complete',
        'csv.urlsImportedSuccess': 'URLs imported successfully.',
        'csv.rowsNotProcessed': 'rows could not be processed.',
        'csv.readErrorTitle': 'Read Error',
        'csv.readErrorText': 'Could not read the selected file.',
        'settings.generalSettings': 'General Settings',
        'settings.importLanguage': 'Content Import Language',
        'settings.displayLanguage': 'Display Language',
        'settings.heroSlider.title': 'Hero Slider',
        'settings.heroSlider.posterAmount': 'Number of Posters',
        'settings.heroSlider.randomAmount': 'Number of Random Posters',
        'settings.heroSlider.recentAmount': 'Number of Recent Posters',
        'settings.categoryVisibility': 'Category Visibility',
        'settings.platformVisibility': 'Platform Visibility',
        'settings.homepagePosters.title': 'Number of Posters in Home Sections',
        'settings.homepagePosters.inTheaters': 'Now Playing/Airing',
        'settings.homepagePosters.recentlyAdded': 'Recently Added',
        'settings.homepagePosters.popularMovies': 'Popular Movies',
        'settings.homepagePosters.popularSeries': 'Popular Series',
        'settings.saveButton': 'Save Settings',
        'settings.saveSuccess': 'Settings have been saved successfully.',
        'settings.saveError': 'Could not save settings.',
    }
};

function getText(key, replacements = {}) {
    const lang = webSettings.displayLanguage || 'es-MX';
    let text = translations[lang]?.[key] || translations['es-MX']?.[key] || key;

    for (const placeholder in replacements) {
        text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    }

    return text;
}

function applyStaticTranslations() {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        el.textContent = getText(key);
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        el.placeholder = getText(key);
    });
}

;(() => {
  const _0x4a2b = {
    logo: atob("U3RyZWFtRnVzaW9u"),
    checks: [],
  }

  function _validateLogo() {
    try {
      const logoElement = document.querySelector("h1.logo-text")
      if (!logoElement) return false

      const logoText = logoElement.textContent.trim()
      if (logoText !== _0x4a2b.logo) {
        _triggerLockdown("LOGO_MODIFIED")
        return false
      }
      return true
    } catch (e) {
      return false
    }
  }

  function _triggerLockdown(reason) {
    try {
      const lockdownDiv = document.createElement("div")
      lockdownDiv.id = "license-lockdown"
      lockdownDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 100%);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `

      lockdownDiv.innerHTML = `
        <div style="text-align: center; color: #fff; max-width: 600px; padding: 40px;">
          <div style="font-size: 80px; margin-bottom: 20px;">🔒</div>
          <h1 style="font-size: 32px; margin-bottom: 20px; color: #ff4444;">Sistema Bloqueado</h1>
          <p style="font-size: 18px; line-height: 1.6; margin-bottom: 30px; color: #ccc;">
            Esta licencia no es valida.
          </p>
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p style="font-size: 14px; color: #ff6666; font-family: monospace;">
              Código de error: ${reason}
            </p>
          </div>
          <p style="font-size: 14px; color: #999;">
            Obten una licencia válida en <a href="https://t.me/blackdestroy06">Telegram</a>
          </p>
        </div>
      `

      document.body.innerHTML = ""
      document.body.appendChild(lockdownDiv)
      document.body.style.overflow = "hidden"
      document.body.style.userSelect = "none"
    } catch (e) {
    }
  }

  function _setupLogoObserver() {
    try {
      const logoElement = document.querySelector("h1.logo-text")
      if (!logoElement) return

      const observer = new MutationObserver((mutations) => {
        try {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList" || mutation.type === "characterData") {
              if (!_validateLogo()) {
                _triggerLockdown("LOGO_MUTATION_DETECTED")
              }
            }
          })
        } catch (e) {
        }
      })

      observer.observe(logoElement, {
        childList: true,
        characterData: true,
        subtree: true,
      })

      _0x4a2b.checks.push(observer)
    } catch (e) {
    }
  }

  function _setupPeriodicCheck() {
    try {
      const checkInterval = setInterval(() => {
        try {
          if (!_validateLogo()) {
            clearInterval(checkInterval)
            _triggerLockdown("PERIODIC_CHECK_FAILED")
          }
        } catch (e) {
        }
      }, 3000)

      _0x4a2b.checks.push(checkInterval)
    } catch (e) {
    }
  }

  function _initLicense() {
    try {
      const waitForLogo = setInterval(() => {
        try {
          if (_validateLogo()) {
            clearInterval(waitForLogo)
            _setupLogoObserver()
            _setupPeriodicCheck()

            window._sfLicenseCore = true

            try {
              Object.defineProperty(window, "_sfLicenseCore", {
                configurable: false,
                writable: false,
                value: true,
              })
            } catch (e) {
            }
          }
        } catch (e) {
        }
      }, 100)
    } catch (e) {
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _initLicense)
  } else {
    _initLicense()
  }
})()





;(() => {
  function _verifyLicenseCore() {
    try {
      if (typeof window._sfLicenseCore === "undefined" || !window._sfLicenseCore) {
        _emergencyLockdown("CORE_LICENSE_MISSING")
        return false
      }
      return true
    } catch (e) {
      _emergencyLockdown("VERIFICATION_ERROR")
      return false
    }
  }

  function _emergencyLockdown(code) {
    try {
      const body = document.body
      body.innerHTML = `
        <div style="position: fixed; inset: 0; background: #000; display: flex; align-items: center; justify-content: center; z-index: 999999;">
          <div style="text-align: center; color: #f00; font-family: monospace;">
            <h1 style="font-size: 48px; margin-bottom: 20px;">⚠️ ACCESO DENEGADO ⚠️</h1>
            <p style="font-size: 20px;">Violación de integridad detectada</p>
            <p style="font-size: 14px; margin-top: 20px; color: #666;">Error: ${code}</p>
          </div>
        </div>
      `
      document.body.style.overflow = "hidden"
    } catch (e) {
      // Silencioso
    }
  }

  function _continuousVerification() {
    try {
      setInterval(() => {
        try {
          if (!_verifyLicenseCore()) {
            _emergencyLockdown("CORE_LICENSE_REMOVED")
          }
        } catch (e) {
          // Silencioso
        }
      }, 5000)
    } catch (e) {
      // Silencioso
    }
  }

  function _init() {
    try {
      setTimeout(() => {
        try {
          if (!_verifyLicenseCore()) {
            _emergencyLockdown("CORE_LICENSE_NOT_FOUND")
            return
          }

          _continuousVerification()

          window._sfLicenseValidator2 = true

          try {
            Object.defineProperty(window, "_sfLicenseValidator2", {
              configurable: false,
              writable: false,
              value: true,
            })
          } catch (e) {
            // Silencioso
          }
        } catch (e) {
          // Silencioso
        }
      }, 1500)
    } catch (e) {
      // Silencioso
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _init)
  } else {
    _init()
  }
})()




;(() => {
  function _verifyChain() {
    try {
      const coreExists = typeof window._sfLicenseCore !== "undefined" && window._sfLicenseCore
      const validator2Exists = typeof window._sfLicenseValidator2 !== "undefined" && window._sfLicenseValidator2

      if (!coreExists) {
        _criticalError("CORE_LICENSE_MISSING")
        return false
      }

      if (!validator2Exists) {
        _criticalError("VALIDATOR2_MISSING")
        return false
      }

      return true
    } catch (e) {
      _criticalError("CHAIN_VERIFICATION_ERROR")
      return false
    }
  }

  function _criticalError(message) {
    try {
      document.body.innerHTML = `
        <div style="position: fixed; inset: 0; background: linear-gradient(45deg, #1a0000, #000); display: flex; align-items: center; justify-content: center; z-index: 999999; font-family: Arial, sans-serif;">
          <div style="max-width: 500px; padding: 40px; background: rgba(255,0,0,0.1); border: 2px solid #ff0000; border-radius: 10px; text-align: center;">
            <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
            <h1 style="color: #ff3333; font-size: 28px; margin-bottom: 15px;">Error Crítico de Licencia</h1>
            <p style="color: #ffaaaa; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Violación de integridad del sistema detectada.
            </p>
            <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <code style="color: #ff6666; font-size: 12px;">${message}</code>
            </div>
            <p style="color: #999; font-size: 12px;">
              Obten una licencia válida en <a href="https://t.me/blackdestroy06">Telegram</a>
            </p>
          </div>
        </div>
      `
      document.body.style.overflow = "hidden"
    } catch (e) {
    }
  }

  function _crossValidate() {
    try {
      setInterval(() => {
        try {
          if (!_verifyChain()) {
            _criticalError("LICENSE_CHAIN_BROKEN")
          }
        } catch (e) {
        }
      }, 4000)
    } catch (e) {
    }
  }

  function _initialize() {
    try {
      setTimeout(() => {
        try {
          if (!_verifyChain()) {
            _criticalError("LICENSE_CHAIN_INCOMPLETE")
            return
          }

          _crossValidate()

          window._sfLicenseValidator3 = true

          try {
            Object.defineProperty(window, "_sfLicenseValidator3", {
              configurable: false,
              writable: false,
              value: true,
            })
          } catch (e) {
          }
        } catch (e) {
        }
      }, 2500)
    } catch (e) {
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _initialize)
  } else {
    _initialize()
  }
})()


// API Configuration
const API_KEY = '32e5e53999e380a0291d66fb304153fe';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p';

const ALL_CATEGORIES = [
    { key: 'genres.action', icon: 'fas fa-fire', genreId: 28 },
    { key: 'genres.adventure', icon: 'fas fa-compass', genreId: 12 },
    { key: 'genres.animation', icon: 'fas fa-child', genreId: 16 },
    { key: 'genres.comedy', icon: 'fas fa-laugh', genreId: 35 },
    { key: 'genres.crime', icon: 'fas fa-mask', genreId: 80 },
    { key: 'genres.documentary', icon: 'fas fa-camera', genreId: 99 },
    { key: 'genres.drama', icon: 'fas fa-theater-masks', genreId: 18 },
    { key: 'genres.family', icon: 'fas fa-home', genreId: 10751 },
    { key: 'genres.fantasy', icon: 'fas fa-hat-wizard', genreId: 14 },
    { key: 'genres.history', icon: 'fas fa-landmark', genreId: 36 },
    { key: 'genres.horror', icon: 'fas fa-ghost', genreId: 27 },
    { key: 'genres.music', icon: 'fas fa-music', genreId: 10402 },
    { key: 'genres.mystery', icon: 'fas fa-search', genreId: 9648 },
    { key: 'genres.romance', icon: 'fas fa-heart', genreId: 10749 },
    { key: 'genres.science_fiction', icon: 'fas fa-rocket', genreId: 878 },
    { key: 'genres.tv_movie', icon: 'fas fa-tv', genreId: 10770 },
    { key: 'genres.thriller', icon: 'fas fa-exclamation-triangle', genreId: 53 },
    { key: 'genres.war', icon: 'fas fa-fighter-jet', genreId: 10752 },
    { key: 'genres.western', icon: 'fas fa-hat-cowboy', genreId: 37 }
];

// DOM Elements - Authentication
const authContainer = document.getElementById('auth-container');
const authCloseBtn = document.getElementById('auth-close-btn');
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerConfirmPassword = document.getElementById('register-confirm-password');
const loginError = document.getElementById("login-error")
const registerError = document.getElementById("register-error")
const registerSuccess = document.getElementById('register-success');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// DOM Elements - Main App
const spinnerContainer = document.getElementById('spinner-container');
const header = document.getElementById('header');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const backToTopBtn = document.getElementById('back-to-top');
const welcomePopup = document.getElementById('welcome-popup');
const closePopup = document.getElementById('close-popup');
const dontShowAgain = document.getElementById('dont-show-again');
const serviceItems = document.querySelectorAll('.service-item');
const hero = document.getElementById('hero');
const enEstrenoSlider = document.getElementById('en-estreno-slider');
const trendingSlider = document.getElementById('trending-slider');
const moviesSlider = document.getElementById('movies-slider');
const seriesSlider = document.getElementById('series-slider');
const sliderPrevBtns = document.querySelectorAll('.slider-prev');
const sliderNextBtns = document.querySelectorAll('.slider-next');
const servicesBackBtn = document.getElementById('services-back-btn');
const categoriesContainer = document.getElementById('categories-container');

// DOM Elements - User Profile
const userProfile = document.getElementById('user-profile');
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');
const userProfilePage = document.getElementById('user-profile-page');
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const infoName = document.getElementById('info-name');
const infoEmail = document.getElementById('info-email');
const infoDate = document.getElementById('info-date');
const profileTabs = document.querySelectorAll('.profile-tab');
const profileSections = document.querySelectorAll('.profile-section');
const profileMyListGrid = document.getElementById('profile-my-list-grid');
const messagesList = document.getElementById('messages-list');
const noMessages = document.getElementById('no-messages');
const backFromProfile = document.getElementById('back-from-profile');

// DOM Elements - User Message Form
const userMessageForm = document.getElementById('user-message-form');
const userMessageContent = document.getElementById('user-message-content');
const sendUserMessageBtn = document.getElementById('send-user-message-btn');
const messageLimitInfo = document.getElementById('message-limit-info');

// DOM Elements - Admin Panel
const adminPanel = document.getElementById('admin-panel');
const adminTabs = document.querySelectorAll('#admin-panel .admin-tab');
const adminSections = document.querySelectorAll('#admin-panel .admin-section');
const usersGrid = document.getElementById('users-grid');
const adminMessageForm = document.getElementById('admin-message-form');
const messageRecipient = document.getElementById('message-recipient');
const messageContent = document.getElementById('message-content');
const backFromAdmin = document.getElementById('back-from-admin');
const registeredUsersCount = document.getElementById('registered-users-count');
const activeUsersCount = document.getElementById('active-users-count');
const userSearchInput = document.getElementById('user-search-input');

// DOM Elements - Management Panel (NEW)
const managementPanel = document.getElementById('management-panel');
const backFromManagement = document.getElementById('back-from-management');
const managementTabs = document.querySelectorAll('#management-tabs .admin-tab');
const managementSections = document.querySelectorAll('#management-panel .admin-section');

// DOM Elements - Admin Messages List (NEW)
const adminMessagesList = document.getElementById('admin-messages-list');
const adminNoMessages = document.getElementById('admin-no-messages');

// DOM Elements - Settings
const settingsTab = document.querySelector('.profile-tab[data-tab="settings"]');
const settingsSection = document.getElementById('settings-section');
const settingsForm = document.getElementById('settings-form');
const importLanguageSelect = document.getElementById('import-language');
const displayLanguageSelect = document.getElementById('display-language');
const heroSliderPostersInput = document.getElementById('hero-slider-posters');
const heroSliderRandomInput = document.getElementById('hero-slider-random');
const heroSliderRecentInput = document.getElementById('hero-slider-recent');
const visibleCategoriesContainer = document.getElementById('visible-categories');
const visiblePlatformsContainer = document.getElementById('visible-platforms');
const postersEnEstrenoInput = document.getElementById('posters-en-estreno');
const postersRecienAgregadoInput = document.getElementById('posters-recien-agregado');
const postersPeliculasPopularesInput = document.getElementById('posters-peliculas-populares');
const postersSeriesPopularesInput = document.getElementById('posters-series-populares');

// DOM Elements - Modals
const importOptionsModal = document.getElementById('import-options-modal');
const closeImportOptionsModal = document.getElementById('close-import-options-modal');
const importMainSection = document.getElementById('import-main-section');
const homeOptionsContainer = document.getElementById('home-options-container');
const cancelImport = document.getElementById('cancel-import');
const confirmImport = document.getElementById('confirm-import');
const importItemId = document.getElementById('import-item-id');
const importItemType = document.getElementById('import-item-type');
const editUserModal = document.getElementById('edit-user-modal');
const editUserForm = document.getElementById('edit-user-form');
const editName = document.getElementById('edit-name');
const editEmail = document.getElementById('edit-email');
const editUserId = document.getElementById('edit-user-id');
const closeEditModal = document.getElementById('close-edit-modal');
const cancelEdit = document.getElementById('cancel-edit');
const saveEdit = document.getElementById('save-edit');
const sendMessageModal = document.getElementById('send-message-modal');
const sendMessageForm = document.getElementById('send-message-form');
const messageTo = document.getElementById('message-to');
const individualMessageContent = document.getElementById('individual-message-content');
const messageUserId = document.getElementById('message-user-id');
const closeMessageModal = document.getElementById('close-message-modal');
const cancelMessage = document.getElementById('cancel-message');
const sendMessage = document.getElementById('send-message');
const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
const deleteUserId = document.getElementById('delete-user-id');
const closeDeleteModal = document.getElementById('close-delete-modal');
const cancelDelete = document.getElementById('cancel-delete');
const confirmDelete = document.getElementById('confirm-delete');

// DOM Elements - Delete Message Confirmation Modal (NEW)
const deleteMessageModal = document.getElementById('delete-message-modal');
const deleteMessageId = document.getElementById('delete-message-id');
const closeDeleteMessageModal = document.getElementById('close-delete-message-modal');
const cancelDeleteMessage = document.getElementById('cancel-delete-message');
const confirmDeleteMessage = document.getElementById('confirm-delete-message');

// DOM Elements - Delete Content Confirmation Modal
const deleteContentConfirmationModal = document.getElementById('delete-content-confirmation-modal');
const closeDeleteContentModal = document.getElementById('close-delete-content-modal');
const cancelDeleteContent = document.getElementById('cancel-delete-content');
const confirmDeleteContent = document.getElementById('confirm-delete-content');
const deleteContentId = document.getElementById('delete-content-id');

// DOM Elements - Message Modal
const messageModal = document.getElementById('message-modal');
const messageModalTitle = document.getElementById('message-modal-title');
const messageModalContent = document.getElementById('message-modal-content');
const closeMessageModalBtn = document.getElementById('close-message-modal-btn');
const messageModalOkBtn = document.getElementById('message-modal-ok-btn');

// DOM Elements - Video URL Modal (NEW)
const videoUrlModal = document.getElementById('video-url-modal');
const videoUrlModalTitle = document.getElementById('video-url-modal-title');
const videoUrlModalBody = document.getElementById('video-url-modal-body');
const closeVideoUrlModal = document.getElementById('close-video-url-modal');
const cancelVideoUrl = document.getElementById('cancel-video-url');
const saveVideoUrls = document.getElementById('save-video-urls');
const importCsvBtn = document.getElementById('import-csv-btn');
const csvFileInput = document.getElementById('csv-file-input');

// View navigation elements
const navLinks = document.querySelectorAll('.nav-link');
const bottomNavItems = document.querySelectorAll('.bottom-nav-item'); // NEW
const seeAllMovies = document.getElementById('see-all-movies');
const seeAllSeries = document.getElementById('see-all-series');
const seeAllEnEstreno = document.getElementById('see-all-en-estreno'); // NUEVO
const backFromMovies = document.getElementById('back-from-movies');
const backFromSeries = document.getElementById('back-from-series');
const backFromAnimes = document.getElementById('back-from-animes');
const backFromDoramas = document.getElementById('back-from-doramas');
const backFromGenre = document.getElementById('back-from-genre');
const backFromSearch = document.getElementById('back-from-search');
const backFromEnEstreno = document.getElementById('back-from-en-estreno'); // NUEVO
const backFromStats = document.getElementById('back-from-stats'); // NEW: Back from Stats
const backFromConnectedUsers = document.getElementById('back-from-connected-users'); // NEW: Back from Connected Users

// Views
const homeView = document.getElementById('home-view');
const moviesView = document.getElementById('movies-view');
const seriesView = document.getElementById('series-view');
const animesView = document.getElementById('animes-view');
const doramasView = document.getElementById('doramas-view');
const genreResultsView = document.getElementById('genre-results-view');
const searchResultsView = document.getElementById('search-results-view');
const enEstrenoView = document.getElementById('en-estreno-view'); // NUEVO
// Nuevas vistas de plataformas
const netflixView = document.getElementById('netflix-view');
const disneyView = document.getElementById('disney-view');
const hboView = document.getElementById('hbo-view');
const primeView = document.getElementById('prime-view');
const paramountView = document.getElementById('paramount-view');
const statsView = document.getElementById('stats-view'); // NEW: Stats View
const connectedUsersView = document.getElementById('connected-users-view'); // NEW: Connected Users View

// Grids
const moviesGrid = document.getElementById('movies-grid');
const seriesGrid = document.getElementById('series-grid');
const animesGrid = document.getElementById('animes-grid');
const doramasGrid = document.getElementById('doramas-grid');
const genreResultsGrid = document.getElementById('genre-results-grid');
const searchResultsGrid = document.getElementById('search-results-grid');
const enEstrenoGrid = document.getElementById('en-estreno-grid');
// Nuevas grids de plataformas
const netflixGrid = document.getElementById('netflix-grid');
const disneyGrid = document.getElementById('disney-grid');
const hboGrid = document.getElementById('hbo-grid');
const primeGrid = document.getElementById('prime-grid');
const paramountGrid = document.getElementById('paramount-grid');
const statsGrid = document.getElementById('stats-grid');
const connectedUsersGrid = document.getElementById('connected-users-grid');

const genreTitle = document.getElementById('genre-title');
const searchResultsTitle = document.getElementById('search-results-title');

// State variables
let webSettings = {
  importLanguage: 'es-MX',
  displayLanguage: 'es-MX',
  heroSlider: {
    posters: 8,
    random: 4,
    recent: 4,
  },
  visibleCategories: [],
  visiblePlatforms: [],
  homepageSections: {
    enEstreno: 20,
    recienAgregado: 20,
    peliculasPopulares: 20,
    seriesPopulares: 20,
  }
};
let currentCategory = 'inicio';
let currentService = null;
let currentGenre = null;
let currentHeroSlide = 0;
let heroInterval;
let allContent = [];
let trendingContent = [];
let moviesContent = [];
let seriesContent = [];
let continueWatchingContent = [];
let currentView = 'home';
let heroSlides = [];
let heroDots = [];
let currentUser = null;
let isAdmin = false;
let messageListeners = {};
let itemToImport = null;

let allAdminUsers = [];
let isEditMode = false; 
let itemToEdit = null;
let currentScrollListener = null;

// --- START OF PAGINATION REFACTOR ---

// General Content Pagination
let contentCurrentPage = 1;
const contentItemsPerPage = 30;
let isContentLoadingMore = false;
let currentContentData = [];
let currentContentGrid = null;
let currentContentLoadMoreBtn = null;

// Admin Users Pagination
let adminUsersCurrentPage = 1;
const adminUsersPerPage = 30;
let isAdminUsersLoadingMore = false;
let currentAdminUsersData = [];

// Manage Content Pagination
let manageContentCurrentPage = 1;
const manageContentPerPage = 30;
let isManageContentLoadingMore = false;
let currentManageContentData = [];

// --- END OF PAGINATION REFACTOR ---


// Admin credentials
const ADMIN_EMAIL = 'javiervelasquez0618@gmail.com';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Main initialization function
function initApp() {
  // Show spinner
  showSpinner();

  // Initialize authentication
  initAuth();

  // Initialize event listeners
  initEventListeners();
}

// Initialize authentication
function initAuth() {
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      hideAuthModal();
      try {
        
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          
          currentUser = {
            id: user.uid,
            ...userDoc.data()
          };

          isAdmin = currentUser.email === ADMIN_EMAIL;

          updateUIForLoggedInUser();

          await updateDoc(doc(db, "users", user.uid), {
            lastActivity: serverTimestamp()
          });

        } else {

          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            registeredAt: serverTimestamp(),
            myList: [],
            messagesSent: [],
            lastActivity: serverTimestamp(),
            isAdmin: user.email === ADMIN_EMAIL
          });

          const newUserDoc = await getDoc(doc(db, "users", user.uid));
          currentUser = {
            id: user.uid,
            ...newUserDoc.data()
          };

          isAdmin = currentUser.email === ADMIN_EMAIL; 

          updateUIForLoggedInUser();
        }
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    } else {
      // No user is signed in
      currentUser = null;
      isAdmin = false;
      updateUIForLoggedInUser();
    }
    // Load content regardless of authentication state
    loadWebSettings().then(() => {
        applyStaticTranslations();
        loadAllContent().then(() => {
            checkWelcomePopup();
            startHeroSlideshow();
            hideSpinner(); // Hide spinner after content is loaded
        });
    });
  });

  // Add event listeners for auth forms
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  showRegister.addEventListener('click', () => {
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
  });
  showLogin.addEventListener('click', () => {
    registerFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
  });
  authCloseBtn.addEventListener('click', hideAuthModal);
}

function handleGoogleSignIn() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    prompt: "select_account",
  })

  signInWithPopup(auth, provider)
    .then((result) => {

      showSpinner()

      hideAuthModal(); 
    })
    .catch((error) => {
      hideSpinner()
      console.error("Error en autenticación con Google:", error)

      // Mostrar error en ambos formularios
      loginError.textContent = "Error al iniciar sesión con Google. Inténtalo de nuevo."
      loginError.style.display = "block"

      registerError.textContent = "Error al registrarse con Google. Inténtalo de nuevo."
      registerError.style.display = "block"
    })
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  // Show spinner
  showSpinner();

  try {
    // Sign in with Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);

    // Clear form
    loginForm.reset();
    loginError.style.display = 'none';
    
  } catch (error) {
    // Hide spinner
    hideSpinner();

    // Show error
    loginError.textContent = getAuthErrorMessage(error.code);
    loginError.style.display = 'block';
  }
}

// Handle register
async function handleRegister(e) {
  e.preventDefault();

  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  const confirmPassword = registerConfirmPassword.value;

  // Validate form
  if (password !== confirmPassword) {
    registerError.textContent = 'Las contraseñas no coinciden';
    registerError.style.display = 'block';
    registerSuccess.style.display = 'none';
    return;
  }

  // Show spinner
  showSpinner();

  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      registeredAt: serverTimestamp(),
      myList: [],
      messagesSent: [],
      lastActivity: serverTimestamp(),
      isAdmin: user.email === ADMIN_EMAIL
    });

    // Show success message
    registerError.style.display = 'none';
    registerSuccess.textContent = 'Registro exitoso. Iniciando sesión...';
    registerSuccess.style.display = 'block';

    // Clear form
    registerForm.reset();
    

  } catch (error) {
    // Hide spinner
    hideSpinner();

    // Show error
    registerError.textContent = getAuthErrorMessage(error.code);
    registerError.style.display = 'block';
    registerSuccess.style.display = 'none';
  }
}

// Get auth error message
function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado';
    case 'auth/invalid-email':
      return 'Correo electrónico inválido';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Correo electrónico o contraseña incorrectos';
    default:
      return 'Error de autenticación: ' + errorCode;
  }
}

function updateUIForLoggedInUser() {
  // Clear existing dropdown items
  profileDropdown.innerHTML = '';

  if (currentUser) {
    // User is logged in
    profileIcon.innerHTML = currentUser.name.charAt(0).toUpperCase();
    profileIcon.title = `${getText('user.profile.welcome')}, ${currentUser.name}`;

    // My Profile link
    const viewProfileItem = document.createElement('div');
    viewProfileItem.className = 'profile-dropdown-item';
    viewProfileItem.id = 'view-profile';
    viewProfileItem.innerHTML = `<i class="fas fa-user-circle"></i><span data-translate="user.profile.dropdown.myProfile">${getText('user.profile.dropdown.myProfile')}</span>`;
    viewProfileItem.addEventListener('click', () => { profileDropdown.classList.remove('active'); showUserProfile(); });
    profileDropdown.appendChild(viewProfileItem);

    // Admin Panel link (if admin)
    if (isAdmin) {
      const adminPanelLinkItem = document.createElement('div');
      adminPanelLinkItem.className = 'profile-dropdown-item';
      adminPanelLinkItem.id = 'admin-panel-link';
      adminPanelLinkItem.innerHTML = `<i class="fas fa-cog"></i><span data-translate="user.profile.dropdown.adminPanel">${getText('user.profile.dropdown.adminPanel')}</span>`;
      adminPanelLinkItem.addEventListener('click', () => { profileDropdown.classList.remove('active'); showAdminPanel(); });
      profileDropdown.appendChild(adminPanelLinkItem);
      
      const managementPanelLinkItem = document.createElement('div');
      managementPanelLinkItem.className = 'profile-dropdown-item';
      managementPanelLinkItem.id = 'management-panel-link';
      managementPanelLinkItem.innerHTML = `<i class="fas fa-database"></i><span data-translate="user.profile.dropdown.management">${getText('user.profile.dropdown.management')}</span>`;
      managementPanelLinkItem.addEventListener('click', () => { profileDropdown.classList.remove('active'); showManagementPanel(); });
      profileDropdown.appendChild(managementPanelLinkItem);

      const statsPanelLinkItem = document.createElement('div');
      statsPanelLinkItem.className = 'profile-dropdown-item';
      statsPanelLinkItem.id = 'stats-panel-link';
      statsPanelLinkItem.innerHTML = `<i class="fas fa-chart-bar"></i><span data-translate="user.profile.dropdown.stats">${getText('user.profile.dropdown.stats')}</span>`;
      statsPanelLinkItem.addEventListener('click', () => { profileDropdown.classList.remove('active'); showStatsPanel(); });
      profileDropdown.appendChild(statsPanelLinkItem);

      const connectedUsersLinkItem = document.createElement('div');
      connectedUsersLinkItem.className = 'profile-dropdown-item';
      connectedUsersLinkItem.id = 'connected-users-link';
      connectedUsersLinkItem.innerHTML = `<i class="fas fa-users"></i><span data-translate="user.profile.dropdown.connected">${getText('user.profile.dropdown.connected')}</span>`;
      connectedUsersLinkItem.addEventListener('click', () => { profileDropdown.classList.remove('active'); showConnectedUsersPanel(); });
      profileDropdown.appendChild(connectedUsersLinkItem);
      
      if (settingsTab) {
        settingsTab.style.display = 'block';
      }
    } else {
        if (settingsTab) {
            settingsTab.style.display = 'none';
        }
    }

    // Logout link
    const logoutBtnItem = document.createElement('div');
    logoutBtnItem.className = 'profile-dropdown-item';
    logoutBtnItem.id = 'logout-btn';
    logoutBtnItem.innerHTML = `<i class="fas fa-sign-out-alt"></i><span data-translate="user.profile.dropdown.logout">${getText('user.profile.dropdown.logout')}</span>`;
    logoutBtnItem.addEventListener('click', handleLogout);
    profileDropdown.appendChild(logoutBtnItem);

  } else {
    // User is not logged in
    profileIcon.innerHTML = '<i class="fas fa-sign-in-alt"></i>'; // Generic icon
    profileIcon.title = getText('auth.loginTitle');

    // Login link
    const loginItem = document.createElement('div');
    loginItem.className = 'profile-dropdown-item';
    loginItem.id = 'show-login-dropdown';
    loginItem.innerHTML = `<i class="fas fa-sign-in-alt"></i><span data-translate="user.profile.dropdown.login">${getText('user.profile.dropdown.login')}</span>`;
    loginItem.addEventListener('click', () => { profileDropdown.classList.remove('active'); showAuthModal(); loginFormContainer.style.display = 'block'; registerFormContainer.style.display = 'none'; });
    profileDropdown.appendChild(loginItem);

    // Register link
    const registerItem = document.createElement('div');
    registerItem.className = 'profile-dropdown-item';
    registerItem.id = 'show-register-dropdown';
    registerItem.innerHTML = `<i class="fas fa-user-plus"></i><span data-translate="user.profile.dropdown.register">${getText('user.profile.dropdown.register')}</span>`;
    registerItem.addEventListener('click', () => { profileDropdown.classList.remove('active'); showAuthModal(); loginFormContainer.style.display = 'none'; registerFormContainer.style.display = 'block'; });
    profileDropdown.appendChild(registerItem);
  }
}

// Show Auth Modal
function showAuthModal() {
  authContainer.style.display = 'flex';
  loginFormContainer.style.display = 'block';
  registerFormContainer.style.display = 'none';
  loginForm.reset();
  registerForm.reset();
  loginError.style.display = 'none';
  registerError.style.display = 'none';
  registerSuccess.style.display = 'none';
}

// Hide Auth Modal
function hideAuthModal() {
  authContainer.style.display = 'none';
}

function initEventListeners() {
  // Header scroll effect
window.addEventListener('scroll', throttle(() => {
  // Header scroll effect
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to top button
  toggleBackToTop();

  initLazyLoading();
}, 100));

window.addEventListener('resize', debounce(() => {
  // Ajusta los sliders si es necesario
  adjustSliders();
}, 200))

  // Search functionality
  searchBtn.addEventListener('click', toggleSearch);
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  searchInput.addEventListener('input', function() {
    if (document.activeElement === searchInput && searchInput.value.trim()) {
      handleSearch();
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container') && searchInput.classList.contains('active')) {
      searchInput.classList.remove('active');
    }
  });

  // Back to top button
  window.addEventListener('scroll', toggleBackToTop);
  backToTopBtn.addEventListener('click', scrollToTop);

  // Welcome popup
  closePopup.addEventListener('click', handleClosePopup);

  // Service selection
  serviceItems.forEach(item => {
    item.addEventListener('click', handleServiceClick);
  });

  // Services back button
  servicesBackBtn.addEventListener('click', resetServices);

  // Slider navigation
  sliderPrevBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const slider = this.closest('.content-slider').querySelector('.slider-container');
      navigateSlider(slider, 'prev');
    });
  });

  sliderNextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const slider = this.closest('.content-slider').querySelector('.slider-container');
      navigateSlider(slider, 'next');
    });
  });

  bottomNavItems.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const section = this.dataset.section;
          navigateToView(section);

          bottomNavItems.forEach(item => item.classList.remove('active'));
          this.classList.add('active');

          navLinks.forEach(navLink => {
              if (navLink.dataset.section === section) {
                  navLink.classList.add('active');
              } else {
                  navLink.classList.remove('active');
              }
          });
      });
  });

  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const section = this.dataset.section;
          navigateToView(section);

          // Actualizar clase 'active' para el menú superior
          navLinks.forEach(item => item.classList.remove('active'));
          this.classList.add('active');

          // Asegurarse de que el menú inferior también se actualice si está visible
          bottomNavItems.forEach(bottomItem => {
              if (bottomItem.dataset.section === section) {
                  bottomItem.classList.add('active');
              } else {
                  bottomItem.classList.remove('active');
              }
          });
      });
  });

  // See all buttons
  if (seeAllMovies) seeAllMovies.addEventListener('click', function(e) { e.preventDefault(); navigateToView('movies'); });
  if (seeAllSeries) seeAllSeries.addEventListener('click', function(e) { e.preventDefault(); navigateToView('series'); });
  if (seeAllEnEstreno) seeAllEnEstreno.addEventListener('click', function(e) { e.preventDefault(); navigateToView('en-estreno'); });

  if (backFromMovies) backFromMovies.addEventListener('click', () => navigateToView('home'));
  if (backFromSeries) backFromSeries.addEventListener('click', () => navigateToView('home'));
  if (backFromAnimes) backFromAnimes.addEventListener('click', () => navigateToView('home'));
  if (backFromDoramas) backFromDoramas.addEventListener('click', () => navigateToView('home'));
  if (backFromGenre) backFromGenre.addEventListener('click', () => navigateToView('home'));
  if (backFromSearch) backFromSearch.addEventListener('click', () => navigateToView('home'));
  if (backFromEnEstreno) backFromEnEstreno.addEventListener('click', () => navigateToView('home'));
  
  const backButtons = ['netflix', 'disney', 'hbo', 'prime', 'paramount', 'stats', 'connected-users'];
  backButtons.forEach(id => {
      const btn = document.getElementById(`back-from-${id}`);
      if (btn) btn.addEventListener('click', () => navigateToView('home'));
  });

  if (profileIcon) {
      profileIcon.addEventListener('click', () => {
          if (!currentUser) {
              showAuthModal();
          } else {
              const wasOpen = profileDropdown.classList.contains('active');
              profileDropdown.classList.toggle('active');
              if (!wasOpen && profileDropdown.classList.contains('active')) {
                  markMessagesAsRead();
              }
          }
      });
  }

  if (document) {
      document.addEventListener('click', (e) => {
          if (currentUser && profileDropdown && !e.target.closest('.user-profile') && profileDropdown.classList.contains('active')) {
              profileDropdown.classList.remove('active');
          }
      });
  }

  if (backFromProfile) backFromProfile.addEventListener('click', () => { userProfilePage.classList.remove('active'); navigateToView('home'); });
  if (backFromAdmin) backFromAdmin.addEventListener('click', () => { adminPanel.classList.remove('active'); navigateToView('home'); });
  if (backFromManagement) backFromManagement.addEventListener('click', () => navigateToView('home'));

  // Profile tabs
  profileTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;

      // Remove active class from all tabs and sections
      profileTabs.forEach(t => t.classList.remove('active'));
      profileSections.forEach(s => s.classList.remove('active'));

      // Add active class to clicked tab and corresponding section
      this.classList.add('active');
      document.getElementById(`${tabName}-section`).classList.add('active');

      // Load content for the tab if needed
      if (tabName === 'my-list') {
        loadUserMyList();
      } else if (tabName === 'messages') {
        loadUserMessages();
        checkUserMessageLimit();
      }
    });
  });

  // Admin tabs
  adminTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;

      // Remove active class from all tabs
      adminTabs.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');

      // Hide all admin sections first
      adminSections.forEach(section => {
        section.style.display = 'none';
      });

      let sectionToShow;
      if (tabName === 'messages') {
        sectionToShow = document.getElementById('admin-messages-section');
      } else {
        sectionToShow = document.getElementById(`${tabName}-section`);
      }
      if (sectionToShow) {
        sectionToShow.style.display = 'block';

        if (tabName === 'users') {
            loadUsers();
        } else if (tabName === 'messages') {
            loadMessageRecipients();
            loadAdminMessages();
        }
      }
    });
  });

  // Management tabs (NEW)
  managementTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;

      managementTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      managementSections.forEach(section => {
        section.style.display = 'none';
      });

      const sectionToShow = document.getElementById(`${tabName}-section`);
      if (sectionToShow) {
        sectionToShow.style.display = 'block';
        if (tabName === 'manage-content') {
            loadAllImportedContent();
        }
      }
    });
  });

  const tmdbSearchBtn = document.getElementById('tmdb-search-btn');
  if(tmdbSearchBtn) {
    tmdbSearchBtn.addEventListener('click', handleTmdbSearch);
  }
  const seedDbBtn = document.getElementById('seed-database-btn');
  if(seedDbBtn) {
    seedDbBtn.addEventListener('click', seedDatabase);
  }

  // Admin message form
  if (adminMessageForm) adminMessageForm.addEventListener('submit', handleSendAdminMessage);

  // User message form
  if (sendUserMessageBtn) sendUserMessageBtn.addEventListener('click', handleSendUserMessage);

  // Settings Form
  if (settingsForm) settingsForm.addEventListener('submit', saveWebSettings);

  // Modal event listeners
  if (closeEditModal) closeEditModal.addEventListener('click', () => editUserModal.style.display = 'none');
  if (cancelEdit) cancelEdit.addEventListener('click', () => editUserModal.style.display = 'none');
  if (saveEdit) saveEdit.addEventListener('click', handleSaveUserEdit);

  if (closeMessageModal) closeMessageModal.addEventListener('click', () => sendMessageModal.style.display = 'none');
  if (cancelMessage) cancelMessage.addEventListener('click', () => sendMessageModal.style.display = 'none');
  if (sendMessage) sendMessage.addEventListener('click', handleSendIndividualMessage);

  if (closeDeleteModal) closeDeleteModal.addEventListener('click', () => deleteConfirmationModal.style.display = 'none');
  if (cancelDelete) cancelDelete.addEventListener('click', () => deleteConfirmationModal.style.display = 'none');
  if (confirmDelete) confirmDelete.addEventListener('click', handleDeleteUser);

  // Delete message modal event listeners
  if (closeDeleteMessageModal) closeDeleteMessageModal.addEventListener('click', () => deleteMessageModal.style.display = 'none');
  if (cancelDeleteMessage) cancelDeleteMessage.addEventListener('click', () => deleteMessageModal.style.display = 'none');
  if (confirmDeleteMessage) confirmDeleteMessage.addEventListener('click', handleDeleteMessage);

  // Delete content modal event listeners
  if (closeDeleteContentModal) closeDeleteContentModal.addEventListener('click', () => deleteContentConfirmationModal.style.display = 'none');
  if (cancelDeleteContent) cancelDeleteContent.addEventListener('click', () => deleteContentConfirmationModal.style.display = 'none');
  if (confirmDeleteContent) confirmDeleteContent.addEventListener('click', handleDeleteContent);
  
    // Video URL Modal Listeners
  if (closeVideoUrlModal) closeVideoUrlModal.addEventListener('click', (e) => { e.preventDefault(); videoUrlModal.style.display = 'none'; });
  if (cancelVideoUrl) cancelVideoUrl.addEventListener('click', (e) => { e.preventDefault(); videoUrlModal.style.display = 'none'; });
  if (saveVideoUrls) saveVideoUrls.addEventListener('click', (e) => { e.preventDefault(); handleSaveUrls(e); });
  if (importCsvBtn) importCsvBtn.addEventListener('click', () => csvFileInput.click());
  if (csvFileInput) csvFileInput.addEventListener('change', handleCsvImport);

  // Google Auth Buttons
  const googleLoginBtn = document.getElementById("google-login-btn");
  if (googleLoginBtn) googleLoginBtn.addEventListener("click", handleGoogleSignIn);
  const googleRegisterBtn = document.getElementById("google-register-btn");
  if (googleRegisterBtn) googleRegisterBtn.addEventListener("click", handleGoogleSignIn);

  // Hero swipe functionality
  if (hero) {
      let touchStartX = 0;
      let touchEndX = 0;
      hero.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
      hero.addEventListener('touchmove', (e) => { touchEndX = e.touches[0].clientX; });
      hero.addEventListener('touchend', () => {
          const swipeDistance = touchEndX - touchStartX;
          if (swipeDistance > 50) { goToHeroSlide((currentHeroSlide - 1 + heroSlides.length) % heroSlides.length); }
          else if (swipeDistance < -50) { goToHeroSlide((currentHeroSlide + 1) % heroSlides.length); }
      });
  }

  // Admin user search input
  if (userSearchInput) userSearchInput.addEventListener('input', debounce(filterUsers, 300));
  const loadMoreUsersBtn = document.getElementById('load-more-users');
  if (loadMoreUsersBtn) loadMoreUsersBtn.addEventListener('click', renderNextAdminUsersBatch);

  // Manage Content search input
  const manageContentSearchInput = document.getElementById('manage-content-search-input');
  if (manageContentSearchInput) manageContentSearchInput.addEventListener('input', debounce(filterManageableContent, 300));
  const loadMoreManageContentBtn = document.getElementById('load-more-manage-content');
  if (loadMoreManageContentBtn) loadMoreManageContentBtn.addEventListener('click', renderNextManageContentBatch);

  // Import Options Modal Listeners
  const resetImportOptionsModal = (e) => {
      if (e) e.preventDefault();
      if (importOptionsModal) {
        importOptionsModal.style.display = 'none';
        const titleEl = document.getElementById('import-options-title');
        if (titleEl) titleEl.textContent = getText('modal.importOptionsTitle');
        if (confirmImport) confirmImport.textContent = getText('modal.importButton');
        if (isEditMode) {
            isEditMode = false;
            itemToEdit = null;
        }
      }
  };
  if (closeImportOptionsModal) closeImportOptionsModal.addEventListener('click', resetImportOptionsModal);
  if (cancelImport) cancelImport.addEventListener('click', resetImportOptionsModal);
  if (confirmImport) confirmImport.addEventListener('click', (e) => { e.preventDefault(); confirmImportWithSections(e); });
}

function showMessageModal(title, content, type = 'info') {
  messageModalTitle.textContent = title;
  messageModalContent.textContent = content;
  messageModal.className = `modal-overlay ${type}`;

  messageModal.style.display = 'flex';

  const closeAndReset = () => {
    messageModal.style.display = 'none';
    messageModal.className = 'modal-overlay'; // Limpiar clases de tipo
    messageModalOkBtn.removeEventListener('click', closeAndReset);
    closeMessageModalBtn.removeEventListener('click', closeAndReset);
    messageModal.querySelector('.modal-overlay').removeEventListener('click', closeAndReset);
  };

  messageModalOkBtn.addEventListener('click', closeAndReset);
  closeMessageModalBtn.addEventListener('click', closeAndReset);
  messageModal.querySelector('.modal-overlay').addEventListener('click', closeAndReset);
}

function toggleProfileDropdown() {
  profileDropdown.classList.toggle('active');
}

async function handleLogout() {
  try {
    // Limpiar todos los listeners de mensajes
    Object.values(messageListeners).forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    messageListeners = {};

    // Sign out from Firebase Auth
    await signOut(auth);

    // Clear current user
    currentUser = null;
    isAdmin = false;

    // Update UI for unauthenticated user
    updateUIForLoggedInUser();

    // Hide all protected views
    userProfilePage.classList.remove('active');
    adminPanel.classList.remove('active');
    statsView.classList.remove('active');
    connectedUsersView.classList.remove('active');
    managementPanel.style.display = 'none';
    loginForm.reset();
    registerForm.reset();
    loginError.style.display = 'none';
    registerError.style.display = 'none';
    registerSuccess.style.display = 'none';

    // Navigate to home view
    navigateToView('home');
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Show user profile
function showUserProfile() {
  if (!currentUser) {
    showAuthModal();
    return;
  }
  // Hide all views
  homeView.classList.remove('active');
  moviesView.classList.remove('active');
  seriesView.classList.remove('active');
  animesView.classList.remove('active');
  doramasView.classList.remove('active');
  genreResultsView.classList.remove('active');
  searchResultsView.classList.remove('active');
  userProfilePage.classList.remove('active');
  adminPanel.classList.remove('active');
  managementPanel.classList.remove('active');
  enEstrenoView.classList.remove('active');
  netflixView.classList.remove('active');
  disneyView.classList.remove('active');
  hboView.classList.remove('active');
  primeView.classList.remove('active');
  paramountView.classList.remove('active');
  statsView.classList.remove('active');
  connectedUsersView.classList.remove('active');

  // Show profile page
  userProfilePage.classList.add('active');

  // Update profile information
  profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  profileName.textContent = currentUser.name;
  profileEmail.textContent = currentUser.email;

  // NEW: Update user info block
  infoName.textContent = currentUser.name;
  infoEmail.textContent = currentUser.email;

  // Format date
  const registeredDate = currentUser.registeredAt instanceof Date
    ? currentUser.registeredAt
    : currentUser.registeredAt?.toDate?.() || new Date();
  infoDate.textContent = registeredDate.toLocaleDateString();

  // Reset tabs
  profileTabs.forEach(tab => tab.classList.remove('active'));
  profileSections.forEach(section => section.classList.remove('active'));
  profileTabs[0].classList.add('active');
  profileSections[0].classList.add('active');

  // Load user's my list
  loadUserMyList();

  // Load user's messages
  loadUserMessages();

  // Check user message limit
  checkUserMessageLimit();

  // Populate settings form if admin
  if (isAdmin) {
    populateSettingsForm();
  }
}

// Load user's my list
async function loadUserMyList() {
    if (!currentUser) return;

    try {
        const userDoc = await getDoc(doc(db, "users", currentUser.id));
        if (userDoc.exists() && userDoc.data().myList && userDoc.data().myList.length > 0) {
            let myList = userDoc.data().myList;
            myList.sort((a, b) => (b.lastVisited || 0) - (a.lastVisited || 0));
            
            // Paginate "My List"
            await setupContentPagination(myList, profileMyListGrid, document.getElementById('load-more-my-list'));
        } else {
            profileMyListGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-list-alt empty-icon"></i>
                    <h3 class="empty-title">${getText('user.profile.myList.emptyTitle')}</h3>
                    <p class="empty-text">${getText('user.profile.myList.emptyText')}</p>
                </div>`;
            document.getElementById('load-more-my-list').parentElement.style.display = 'none';
        }
    } catch (error) {
        console.error("Error loading user's my list:", error);
        profileMyListGrid.innerHTML = `<div class="empty-state error">${getText('user.profile.myList.loadError')}</div>`;
    }
}


// Load user's messages with real-time updates
function loadUserMessages() {
  if (!currentUser) return;

  try {
    // Limpiar listener anterior si existe
    if (messageListeners[currentUser.id]) {
      messageListeners[currentUser.id]();
    }

    // Mostrar estado de carga
    messagesList.innerHTML = `
      <div class="message-item" style="text-align: center;">
        <div class="spinner" style="width: 30px; height: 30px; margin: 0 auto;"></div>
        <p style="margin-top: 10px;">${getText('user.messages.loading')}</p>
      </div>
    `;
    noMessages.style.display = 'none';

    const messagesQuery = query(
      collection(db, "messages"),
      where("to", "in", [currentUser.id, "all"]),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const userMessages = [];

      snapshot.forEach((doc) => {
        userMessages.push({
          id: doc.id,
          ...doc.data()
        });
      });

      if (userMessages.length > 0) {
        noMessages.style.display = 'none';
        messagesList.innerHTML = '';

        userMessages.forEach(message => {
          const messageDate = message.date instanceof Date
            ? message.date
            : message.date?.toDate?.() || new Date();

          const messageItem = document.createElement('div');
          messageItem.className = 'message-item';

          const canDelete = (message.from === currentUser.id) || isAdmin;

          messageItem.innerHTML = `
            <div class="message-header">
              <span class="message-sender">${message.from === 'admin' ? getText('user.messages.sender.admin') : message.from === currentUser.id ? getText('user.messages.sender.you') : getText('user.messages.sender.system')}</span>
              <span class="message-date">${messageDate.toLocaleString()}</span>
            </div>
            <div class="message-content">${message.content}</div>
            ${canDelete ? `
              <div class="message-actions">
                <button class="message-delete-btn" data-id="${message.id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            ` : ''}
          `;

          messagesList.appendChild(messageItem);

          // Agregar event listener al botón de eliminar si existe
          if (canDelete) {
            const deleteBtn = messageItem.querySelector('.message-delete-btn');
            deleteBtn.addEventListener('click', () => {
              showDeleteMessageModal(message.id);
            });
          }
        });

        const unreadMessages = userMessages.filter(message =>
          message.from === 'admin' && !message.read
        );
        updateNotificationBadge(unreadMessages.length);

      } else {
        noMessages.style.display = 'block';
        messagesList.innerHTML = '';
        updateNotificationBadge(0); // AÑADIR ESTA LÍNEA
      }
    }, (error) => {
      console.error("Error loading user's messages:", error);
      noMessages.style.display = 'none';
      messagesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle empty-icon"></i>
          <h3 class="empty-title">${getText('user.messages.loadError')}</h3>
          <p class="empty-text">${getText('user.messages.loadError')}</p>
        </div>
      `;
      updateNotificationBadge(0); // AÑADIR ESTA LÍNEA
    });

    // Guardar referencia al listener para limpiarlo después
    messageListeners[currentUser.id] = unsubscribe;

  } catch (error) {
    console.error("Error setting up message listener:", error);
    noMessages.style.display = 'none';
    messagesList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle empty-icon"></i>
        <h3 class="empty-title">${getText('user.messages.loadError')}</h3>
        <p class="empty-text">${getText('user.messages.loadError')}</p>
      </div>
    `;
    updateNotificationBadge(0); // AÑADIR ESTA LÍNEA
  }
}

// Añadir esta función después de loadUserMessages
function updateNotificationBadge(count) {
  const profileIcon = document.getElementById('profile-icon');

  // Eliminar badge existente si hay alguno
  const existingBadge = profileIcon.querySelector('.notification-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  // Añadir nuevo badge si hay mensajes no leídos
  if (count > 0) {
    const badge = document.createElement('div');
    badge.className = 'notification-badge';
    badge.textContent = count > 9 ? '9+' : count;
    profileIcon.appendChild(badge);
  }
}

// Añadir esta función para marcar mensajes como leídos
async function markMessagesAsRead() {
  if (!currentUser) return;

  try {
    // Obtener todos los mensajes no leídos para el usuario
    const messagesQuery = query(
      collection(db, "messages"),
      where("to", "in", [currentUser.id, "all"]),
      where("read", "==", false)
    );

    const unreadSnapshot = await getDocs(messagesQuery);

    // Si no hay mensajes no leídos, salir
    if (unreadSnapshot.empty) return;

    // Actualizar cada mensaje para marcarlo como leído
    const batch = writeBatch(db);
    unreadSnapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();

    // Actualizar el badge de notificación
    updateNotificationBadge(0);

  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}

// Check user message limit
async function checkUserMessageLimit() {
  if (!currentUser || isAdmin) {
    // Los administradores no tienen límite de mensajes
    sendUserMessageBtn.disabled = false;
    userMessageContent.value = ''; // Clear message content
    messageLimitInfo.textContent = getText('user.messages.adminNoLimit');
    messageLimitInfo.className = 'message-limit-info';
    return;
  }

  try {
    // Obtener el documento del usuario para verificar los mensajes enviados
    const userDoc = await getDoc(doc(db, "users", currentUser.id));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const messagesSent = userData.messagesSent || [];

      // Obtener la fecha actual (solo año, mes, día)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filtrar mensajes enviados hoy
      const messagesToday = messagesSent.filter(msg => {
        const msgDate = msg.date instanceof Date
          ? msg.date
          : msg.date?.toDate?.() || new Date();

        const msgDateOnly = new Date(msgDate);
        msgDateOnly.setHours(0, 0, 0, 0);

        return msgDateOnly.getTime() === today.getTime();
      });

      // Verificar si el usuario ha alcanzado el límite diario
      if (messagesToday.length >= 2) {
        sendUserMessageBtn.disabled = true;
        messageLimitInfo.textContent = getText('user.messages.messageLimit.limitReached');
        messageLimitInfo.className = 'message-limit-info message-limit-warning';
      } else {
        sendUserMessageBtn.disabled = false;
        messageLimitInfo.textContent = getText('user.messages.messageLimit.canSend', { count: 2 - messagesToday.length });
        messageLimitInfo.className = 'message-limit-info';
      }
    }
  } catch (error) {
    console.error("Error checking message limit:", error);
    sendUserMessageBtn.disabled = false;
    messageLimitInfo.textContent = getText('user.messages.messageLimit.error');
    messageLimitInfo.className = 'message-limit-info';
  }
}

async function handleSendUserMessage() {
  if (!currentUser) {
    showMessageModal(getText('user.profile.restrictedAccess'), getText('user.profile.loginRequired'), 'info');
    showAuthModal();
    return;
  }

  const content = userMessageContent.value.trim();

  // Validate form
  if (!content) {
    showMessageModal(getText('user.messages.sendError.noMessage'), getText('user.messages.sendError.noMessage'), 'error');
    return;
  }

  try {
    // Mostrar indicador de carga
    sendUserMessageBtn.textContent = getText('user.messages.sending');
    sendUserMessageBtn.disabled = true;

    // Obtener la fecha actual
    const now = new Date();

    // Agregar mensaje a Firestore
    const messageRef = await addDoc(collection(db, "messages"), {
      from: currentUser.id,
      to: 'admin',
      content: content,
      date: serverTimestamp(),
      read: false,
      userName: currentUser.name
    });

    // Actualizar el registro de mensajes enviados por el usuario
    const userRef = doc(db, "users", currentUser.id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const messagesSent = userData.messagesSent || [];

      // Agregar el nuevo mensaje al registro
      messagesSent.push({
        id: messageRef.id,
        date: now

      });

      // Actualizar el documento del usuario
      await updateDoc(userRef, {
        messagesSent: messagesSent
      });
    }

    // Limpiar el formulario
    userMessageContent.value = '';

    // Restaurar botón
    sendUserMessageBtn.textContent = getText('user.messages.sendMessage');

    // Verificar límite de mensajes
    checkUserMessageLimit();

    // Mostrar mensaje de éxito
    showMessageModal(getText('user.messages.sendSuccess'), getText('user.messages.sendSuccess'), 'success');
  } catch (error) {
    console.error("Error sending user message:", error);
    showMessageModal(getText('user.messages.sendError.general'), getText('user.messages.sendError.general'), 'error');

    // Restaurar botón
    sendUserMessageBtn.textContent = getText('user.messages.sendMessage');
    sendUserMessageBtn.disabled = false;
  }
}

// Show delete message modal
function showDeleteMessageModal(messageId) {
  deleteMessageId.value = messageId;
  deleteMessageModal.style.display = 'block';
}

// Handle delete message
async function handleDeleteMessage() {
  const messageId = deleteMessageId.value;

  try {
    // Eliminar mensaje de Firestore
    await deleteDoc(doc(db, "messages", messageId));

    if (!isAdmin) {
      const userRef = doc(db, "users", currentUser.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        let messagesSent = userData.messagesSent || [];

        // Filtrar el mensaje eliminado
        messagesSent = messagesSent.filter(msg => msg.id !== messageId);

        // Actualizar el documento del usuario
        await updateDoc(userRef, {
          messagesSent: messagesSent
        });

        // Verificar límite de mensajes
        checkUserMessageLimit();
      }
    }

    // Cerrar modal
    deleteMessageModal.style.display = 'none';

    // Mostrar mensaje de éxito
    showMessageModal(getText('user.messages.deleteSuccess'), getText('user.messages.deleteSuccess'), 'success');
  } catch (error) {
    console.error("Error deleting message:", error);
    showMessageModal(getText('user.messages.deleteError'), getText('user.messages.deleteError'), 'error');
  }
}

// Show admin panel
function showAdminPanel() {
  if (!currentUser || !isAdmin) {
    showMessageModal(getText('user.profile.restrictedAccess'), getText('admin.noAccess'), 'error');
    showAuthModal();
    return;
  }

  // Hide all views
  homeView.classList.remove('active');
  moviesView.classList.remove('active');
  seriesView.classList.remove('active');
  animesView.classList.remove('active');
  doramasView.classList.remove('active');
  genreResultsView.classList.remove('active');
  searchResultsView.classList.remove('active');
  userProfilePage.classList.remove('active');
  adminPanel.classList.add('active');
  managementPanel.style.display = 'none';
  enEstrenoView.classList.remove('active');
  netflixView.classList.remove('active');
  disneyView.classList.remove('active');
  hboView.classList.remove('active');
  primeView.classList.remove('active');
  paramountView.classList.remove('active');
  statsView.classList.remove('active');
  connectedUsersView.classList.remove('active');

  // Reset tabs
  adminTabs.forEach(tab => tab.classList.remove('active'));
  adminTabs[0].classList.add('active');
  document.getElementById('users-section').style.display = 'block';
  document.getElementById('messages-section').style.display = 'none';
  loadUsers();
  loadMessageRecipients();
}

function showManagementPanel() {
    if (!currentUser || !isAdmin) {
        showMessageModal(getText('user.profile.restrictedAccess'), getText('management.noAccess'), 'error');
        showAuthModal();
        return;
    }

    navigateToView('management');

    // Reset tabs
    managementTabs.forEach(tab => tab.classList.remove('active'));
    managementTabs[0].classList.add('active');
    managementSections.forEach(section => section.style.display = 'none');
    managementSections[0].style.display = 'block';
}

// NEW: Show Stats Panel
function showStatsPanel() {
  if (!currentUser || !isAdmin) {
    showMessageModal(getText('user.profile.restrictedAccess'), getText('stats.noAccess'), 'error');
    showAuthModal();
    return;
  }

  // Hide all views
  homeView.classList.remove('active');
  moviesView.classList.remove('active');
  seriesView.classList.remove('active');
  animesView.classList.remove('active');
  doramasView.classList.remove('active');
  genreResultsView.classList.remove('active');
  searchResultsView.classList.remove('active');
  userProfilePage.classList.remove('active');
  adminPanel.classList.remove('active');
  managementPanel.style.display = 'none';
  enEstrenoView.classList.remove('active');
  netflixView.classList.remove('active');
  disneyView.classList.remove('active');
  hboView.classList.remove('active');
  primeView.classList.remove('active');
  paramountView.classList.remove('active');
  connectedUsersView.classList.remove('active');

  // Show stats panel
  statsView.classList.add('active');

  // Load stats content
  loadStatsContent();
}

function showConnectedUsersPanel() {
  if (!currentUser || !isAdmin) {
    showMessageModal(getText('user.profile.restrictedAccess'), getText('connectedUsers.noAccess'), 'error');
    showAuthModal();
    return;
  }

  // Hide all views
  homeView.classList.remove('active');
  moviesView.classList.remove('active');
  seriesView.classList.remove('active');
  animesView.classList.remove('active');
  doramasView.classList.remove('active');
  genreResultsView.classList.remove('active');
  searchResultsView.classList.remove('active');
  userProfilePage.classList.remove('active');
  adminPanel.classList.remove('active');
  managementPanel.style.display = 'none';
  enEstrenoView.classList.remove('active');
  netflixView.classList.remove('active');
  disneyView.classList.remove('active');
  hboView.classList.remove('active');
  primeView.classList.remove('active');
  paramountView.classList.remove('active');
  statsView.classList.remove('active');

  // Show connected users panel
  connectedUsersView.classList.add('active');

  // Load connected users content
  loadConnectedUsers();
}

// NEW: Load Stats Content
async function loadStatsContent() {
  showSpinner();
  try {
    const q = query(
      collection(db, "posterClicks"),
      orderBy("clickCount", "desc")
    );
    const querySnapshot = await getDocs(q);
    const statsData = [];
    let position = 1;
    querySnapshot.forEach((doc) => {
      statsData.push({
        id: doc.id, // Document ID is posterId
        position: position++,
        ...doc.data()
      });
    });
    renderStatsGrid(statsData);
  } catch (error) {
    console.error("Error loading stats content:", error);
    statsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-exclamation-circle empty-icon"></i>
        <h3 class="empty-title">${getText('stats.loadError.title')}</h3>
        <p class="empty-text">${getText('stats.loadError.text')}</p>
      </div>
    `;
  } finally {
    hideSpinner();
  }
}

// NEW: Render Stats Grid
function renderStatsGrid(content) {
  statsGrid.innerHTML = '';

  if (content.length === 0) {
    statsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-chart-bar empty-icon"></i>
        <h3 class="empty-title">${getText('stats.empty.title')}</h3>
        <p class="empty-text">${getText('stats.empty.text')}</p>
      </div>
    `;
    return;
  }

  content.forEach(item => {
    const card = document.createElement('div');
    card.className = 'stats-card';
    card.dataset.id = item.posterId;
    card.dataset.type = item.mediaType;

    const posterPath = item.posterPath
      ? `${IMG_BASE_URL}/w500${item.posterPath}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

    const title = item.title || getText('content.noTitle');
    const type = item.mediaType === 'movie' ? getText('content.type.movie') : getText('content.type.series');

    card.innerHTML = `
      <img src="${posterPath}" alt="${title}" class="stats-poster">
      <div class="stats-position">${item.position}</div>
      <div class="stats-click-count">${item.clickCount} Clicks</div>
      <div class="stats-info">
        <h3 class="stats-title">${title}</h3>
        <div class="stats-meta">
          <span>${type}</span>
        </div>
      </div>
      <div class="stats-actions">
        <button class="stats-btn play-btn" title="${getText('actions.watchNow')}">
          <i class="fas fa-play"></i>
        </button>
        <button class="stats-btn info-btn" title="${getText('actions.info')}">
          <i class="fas fa-info"></i>
        </button>
      </div>
    `;

    // Add event listeners for stats cards
    card.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      // No need to update click count again here, it's already tracked
      window.open(`go:${item.posterId}`, '_blank');
    });

    card.querySelector('.info-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showMovieDetailsModal(item.posterId, item.mediaType);
    });

    card.addEventListener('click', () => {
      // No need to update click count again here, it's already tracked
      window.open(`go:${item.posterId}`, '_blank');
    });

    statsGrid.appendChild(card);
  });
  initLazyLoading();
}

async function loadUsers() {
    if (!isAdmin) return;

    showSpinner();
    try {
        if (allAdminUsers.length === 0) {
            const usersSnapshot = await getDocs(collection(db, "users"));
            allAdminUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        registeredUsersCount.textContent = allAdminUsers.length;

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const activeUsers = allAdminUsers.filter(user => (user.lastActivity?.toDate?.() || new Date(0)) > oneHourAgo);
        activeUsersCount.textContent = activeUsers.length;

        filterUsers();

    } catch (error) {
        console.error("Error loading users:", error);
        usersGrid.innerHTML = `<div class="empty-state error">${getText('admin.loadUsersError')}</div>`;
    } finally {
        hideSpinner();
    }
}

function filterUsers() {
    const query = userSearchInput.value.toLowerCase().trim();
    currentAdminUsersData = allAdminUsers.filter(user => {
        const name = user.name ? user.name.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        return name.includes(query) || email.includes(query);
    });

    adminUsersCurrentPage = 1;
    usersGrid.innerHTML = '';
    renderNextAdminUsersBatch();
}

function renderNextAdminUsersBatch() {
    if (isAdminUsersLoadingMore) return;
    isAdminUsersLoadingMore = true;

    const startIndex = (adminUsersCurrentPage - 1) * adminUsersPerPage;
    const endIndex = startIndex + adminUsersPerPage;
    const batch = currentAdminUsersData.slice(startIndex, endIndex);

    renderAdminUsers(batch, true); // Append users
    adminUsersCurrentPage++;

    const loadMoreButton = document.getElementById('load-more-users');
    if (loadMoreButton) {
        if (endIndex >= currentAdminUsersData.length) {
            loadMoreButton.parentElement.style.display = 'none';
        } else {
            loadMoreButton.parentElement.style.display = 'block';
        }
    }
    
    if (currentAdminUsersData.length === 0 && startIndex === 0) {
        usersGrid.innerHTML = `<div class="empty-state">${getText('admin.noUsersFound')}</div>`;
    }

    isAdminUsersLoadingMore = false;
}


function renderAdminUsers(usersToRender, append = false) {
  if (!append) {
    usersGrid.innerHTML = '';
  }

  usersToRender.forEach(user => {
    const registeredDate = user.registeredAt instanceof Date
      ? user.registeredAt
      : user.registeredAt?.toDate?.() || new Date();

    const lastActivityDate = user.lastActivity instanceof Date
      ? user.lastActivity
      : user.lastActivity?.toDate?.() || null;

    const lastActivityText = lastActivityDate
      ? lastActivityDate.toLocaleString()
      : getText('admin.never');

    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    userCard.innerHTML = `
      <div class="user-card-header">
        <div class="user-card-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="user-card-info">
          <h4>${user.name}</h4>
          <p>${user.email}</p>
        </div>
      </div>
      <div class="user-card-body">
        <p><strong>${getText('admin.registeredLabel')}</strong> ${registeredDate.toLocaleDateString()}</p>
        <p><strong>${getText('admin.lastActivityLabel')}</strong> ${lastActivityText}</p>
      </div>
      <div class="user-card-actions">
        <button class="admin-action-btn edit" data-id="${user.id}">${getText('actions.edit')}</button>
        <button class="admin-action-btn message" data-id="${user.id}" data-name="${user.name}">${getText('actions.message')}</button>
        <button class="admin-action-btn delete" data-id="${user.id}">${getText('actions.delete')}</button>
      </div>
    `;

    usersGrid.appendChild(userCard);
  });

  // Re-attach event listeners to action buttons after rendering
  usersGrid.querySelectorAll('.edit').forEach(button => {
    button.addEventListener('click', () => {
      const userId = button.dataset.id;
      showEditUserModal(userId);
    });
  });

  usersGrid.querySelectorAll('.message').forEach(button => {
    button.addEventListener('click', () => {
      const userId = button.dataset.id;
      const userName = button.dataset.name;
      showSendMessageModal(userId, userName);
    });
  });

  usersGrid.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', () => {
      const userId = button.dataset.id;
      showDeleteConfirmationModal(userId);
    });
  });
}

async function loadMessageRecipients() {
  if (!isAdmin) return;

  try {
    // Clear previous options
    while (messageRecipient.options.length > 1) {
      messageRecipient.remove(1);
    }

    const usersSnapshot = await getDocs(collection(db, "users"));

    // Add users as options
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = userData.name;
      messageRecipient.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading message recipients:", error);
  }
}

function loadAdminMessages() {
  console.log('Paso 1: Se llamó a loadAdminMessages. El valor de isAdmin es:', isAdmin);
  if (!isAdmin) return;

  try {
    // Limpiar listener anterior si existe
    if (messageListeners['admin']) {
      messageListeners['admin']();
    }

    // Mostrar estado de carga
    adminMessagesList.innerHTML = `
      <div class="message-item" style="text-align: center;">
        <div class="spinner" style="width: 30px; height: 30px; margin: 0 auto;"></div>
        <p style="margin-top: 10px;">${getText('user.messages.loading')}</p>
      </div>
    `;
    adminNoMessages.style.display = 'none';

    const messagesQuery = query(
      collection(db, "messages"),
      where("to", "==", "admin"),
      orderBy("date", "desc")
    );

const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
  console.log('Paso 2: Respuesta de Firestore recibida. Documentos:', snapshot.size);
  const adminMessages = [];

      for (const docSnapshot of snapshot.docs) {
        const messageData = docSnapshot.data();

        if (messageData.from !== 'admin') {
          try {
            const userDoc = await getDoc(doc(db, "users", messageData.from));
            const userName = userDoc.exists() ? userDoc.data().name : getText('admin.unknownUser');

            adminMessages.push({
              id: docSnapshot.id,
              ...messageData,
              userName: messageData.userName || userName
            });
          } catch (error) {
            console.error("Error getting user data for message:", error);
            adminMessages.push({
              id: docSnapshot.id,
              ...messageData,
              userName: getText('admin.unknownUser')
            });
          }
        } else {
          adminMessages.push({
            id: docSnapshot.id,
            ...messageData
          });
        }
      }
  console.log('Paso 3: Mensajes procesados. Total:', adminMessages.length);

  if (adminMessages.length > 0) {
        adminNoMessages.style.display = 'none';
        adminMessagesList.innerHTML = '';

        adminMessages.forEach(message => {
          const messageDate = message.date instanceof Date
            ? message.date
            : message.date?.toDate?.() || new Date();

          const messageItem = document.createElement('div');
          messageItem.className = 'message-item';

          messageItem.innerHTML = `
            <div class="message-header">
              <span class="message-sender">${getText('admin.fromLabel')} ${message.userName || getText('admin.user')}</span>
              <span class="message-date">${messageDate.toLocaleString()}</span>
            </div>
            <div class="message-content">${message.content}</div>
            <div class="message-actions">
              <button class="message-delete-btn" data-id="${message.id}">
                <i class="fas fa-trash"></i>
              </button>
              <button class="admin-action-btn message" data-id="${message.from}" data-name="${message.userName || getText('admin.user')}" style="margin-left: 10px; background-color: var(--accent-color); color: white; border-radius: 4px; padding: 4px 8px; font-size: 0.8rem;">
                <i class="fas fa-reply"></i> ${getText('actions.reply')}
              </button>
            </div>
          `;

          adminMessagesList.appendChild(messageItem);

          const deleteBtn = messageItem.querySelector('.message-delete-btn');
          deleteBtn.addEventListener('click', () => {
            showDeleteMessageModal(message.id);
          });

          const replyBtn = messageItem.querySelector('.admin-action-btn.message');
          replyBtn.addEventListener('click', () => {
            showSendMessageModal(message.from, message.userName || getText('admin.user'));
          });
        });
  } else {
    console.log('Paso 4: No hay mensajes para renderizar.');
    adminNoMessages.style.display = 'block';
    adminMessagesList.innerHTML = '';
  }
    }, (error) => {
      console.error("Error loading admin messages:", error);
      adminNoMessages.style.display = 'none';
      adminMessagesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle empty-icon"></i>
          <h3 class="empty-title">${getText('user.messages.loadError')}</h3>
          <p class="empty-text">${getText('user.messages.loadError')}</p>
        </div>
      `;
    });

    // Guardar referencia al listener para limpiarlo después
    messageListeners['admin'] = unsubscribe;

  } catch (error) {
    console.error("Error setting up admin message listener:", error);
    adminNoMessages.style.display = 'none';
    adminMessagesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle empty-icon"></i>
          <h3 class="empty-title">${getText('user.messages.loadError')}</h3>
          <p class="empty-text">${getText('user.messages.loadError')}</p>
        </div>
      `;
  }
}

async function showEditUserModal(userId) {
  try {
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();

      editName.value = userData.name;
      editEmail.value = userData.email;
      editUserId.value = userId;

      editUserModal.style.display = 'block';
    }
  } catch (error) {
    console.error("Error getting user data for edit:", error);
    showMessageModal(getText('modal.errorTitle'), getText('modal.loadUserError'), 'error');
  }
}

// Handle save user edit
async function handleSaveUserEdit() {
  const userId = editUserId.value;
  const name = editName.value.trim();
  const email = editEmail.value.trim();

  // Validate form
  if (!name || !email) {
    showMessageModal(getText('modal.validationErrorTitle'), getText('modal.validationErrorText'), 'error');
    return;
  }

  try {
    // Update user in Firestore
    await updateDoc(doc(db, "users", userId), {
      name: name,
      email: email
    });

    // Close modal
    editUserModal.style.display = 'none';

    allAdminUsers = [];
    loadUsers();

    // Show success message
    showMessageModal(getText('modal.updateSuccessTitle'), getText('modal.updateSuccessText'), 'success');
  } catch (error) {
    console.error("Error updating user:", error);
    showMessageModal(getText('modal.updateErrorTitle'), getText('modal.updateErrorText'), 'error');
  }
}

function showSendMessageModal(userId, userName) {
  messageTo.value = userName;
  messageUserId.value = userId;
  individualMessageContent.value = '';

  sendMessageModal.style.display = 'block';
}

async function handleSendIndividualMessage() {
  const userId = messageUserId.value;
  const content = individualMessageContent.value.trim();

  // Validate form
  if (!content) {
    showMessageModal(getText('user.messages.sendError.noMessage'), getText('user.messages.sendError.noMessage'), 'error');
    return;
  }

  try {
    // Mostrar indicador de carga
    sendMessage.textContent = getText('user.messages.sending');
    sendMessage.disabled = true;

    // Add message to Firestore
    await addDoc(collection(db, "messages"), {
      from: 'admin',
      to: userId,
      content: content,
      date: serverTimestamp(),
      read: false
    });

    // Close modal
    sendMessageModal.style.display = 'none';

    // Reset button state
    sendMessage.textContent = getText('modal.sendButton');
    sendMessage.disabled = false;

    // Show success message
    showMessageModal(getText('user.messages.sendSuccess'), getText('user.messages.sendSuccess'), 'success');
  } catch (error) {
    console.error("Error sending message:", error);
    showMessageModal(getText('user.messages.sendError.general'), getText('user.messages.sendError.general'), 'error');

    // Reset button state
    sendMessage.textContent = getText('modal.sendButton');
    sendMessage.disabled = false;
  }
}

async function handleSendAdminMessage(e) {
  e.preventDefault();

  const recipient = messageRecipient.value;
  const content = messageContent.value.trim();

  // Validate form
  if (!content) {
    showMessageModal(getText('user.messages.sendError.noMessage'), getText('user.messages.sendError.noMessage'), 'error');
    return;
  }

  try {
    // Mostrar indicador de carga
    const submitBtn = adminMessageForm.querySelector('button[type="submit"]');
    submitBtn.textContent = getText('user.messages.sending');
    submitBtn.disabled = true;

    // Add message to Firestore
    await addDoc(collection(db, "messages"), {
      from: 'admin',
      to: recipient,
      content: content,
      date: serverTimestamp(),
      read: false
    });

    // Reset form
    adminMessageForm.reset();

    // Restaurar botón
    submitBtn.textContent = getText('admin.sendMessageButton');
    submitBtn.disabled = false;

    // Show success message
    showMessageModal(getText('user.messages.sendSuccess'), getText('user.messages.sendSuccess'), 'success');
  } catch (error) {
    console.error("Error sending message:", error);
    showMessageModal(getText('user.messages.sendError.general'), getText('user.messages.sendError.general'), 'error');

    // Restaurar botón
    const submitBtn = adminMessageForm.querySelector('button[type="submit"]');
    submitBtn.textContent = getText('admin.sendMessageButton');
    submitBtn.disabled = false;
  }
}

function showDeleteConfirmationModal(userId) {
  deleteUserId.value = userId;
  deleteConfirmationModal.style.display = 'block';
}

// Handle delete user
async function handleDeleteUser() {
  const userId = deleteUserId.value;

  try {
    // Delete user from Firestore
    await deleteDoc(doc(db, "users", userId));

    // Close modal
    deleteConfirmationModal.style.display = 'none';

    allAdminUsers = [];
    loadUsers();

    // Show success message
    showMessageModal(getText('modal.deleteUserSuccessTitle'), getText('modal.deleteUserSuccessText'), 'success');
  } catch (error) {
    console.error("Error deleting user:", error);
    showMessageModal(getText('modal.deleteErrorTitle'), getText('modal.deleteErrorText'), 'error');
  }
}

async function loadConnectedUsers() {
  showSpinner();
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // Last 5 minutes
    const q = query(
      collection(db, "users"),
      where("lastActivity", ">=", fiveMinutesAgo),
      orderBy("lastActivity", "desc")
    );
    const querySnapshot = await getDocs(q);
    const connectedUsers = [];
    querySnapshot.forEach((doc) => {
      connectedUsers.push({ id: doc.id, ...doc.data() });
    });
    renderConnectedUsersGrid(connectedUsers);
  } catch (error) {
    console.error("Error loading connected users:", error);
    connectedUsersGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-exclamation-circle empty-icon"></i>
        <h3 class="empty-title">${getText('connectedUsers.loadError.title')}</h3>
        <p class="empty-text">${getText('connectedUsers.loadError.text')}</p>
      </div>
    `;
  } finally {
    hideSpinner();
  }
}

function renderConnectedUsersGrid(users) {
  connectedUsersGrid.innerHTML = '';

  if (users.length === 0) {
    connectedUsersGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-users-slash empty-icon"></i>
        <h3 class="empty-title">${getText('connectedUsers.empty.title')}</h3>
        <p class="empty-text">${getText('connectedUsers.empty.text')}</p>
      </div>
    `;
    return;
  }

  users.forEach(user => {
    const lastActivityDate = user.lastActivity instanceof Date
      ? user.lastActivity
      : user.lastActivity?.toDate?.() || null;

    const lastActivityText = lastActivityDate
      ? `${getText('admin.lastActivityLabel')} ${lastActivityDate.toLocaleTimeString()}`
      : `${getText('admin.lastActivityLabel')} ${getText('admin.notAvailable')}`;

    const userCard = document.createElement('div');
    userCard.className = 'user-card'; // Reutiliza la clase user-card para el estilo

    userCard.innerHTML = `
      <div class="user-card-header">
        <div class="user-card-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="user-card-info">
          <h4>${user.name}</h4>
          <p>${user.email}</p>
        </div>
      </div>
      <div class="user-card-body">
        <p><strong>${getText('admin.statusLabel')}</strong> <span style="color: var(--success-color); font-weight: bold;">${getText('admin.statusConnected')}</span></p>
        <p>${lastActivityText}</p>
      </div>
    `;
    connectedUsersGrid.appendChild(userCard);
  });
}


// Reset services function
function resetServices() {
    currentService = null;
    serviceItems.forEach(item => item.classList.remove('active'));
    navigateToView('home'); // Just navigate home, which will re-render everything correctly
    servicesBackBtn.style.display = 'none';
}

// Navigate to a specific view
async function navigateToView(view) {
    // Hide all views and reset active links
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    bottomNavItems.forEach(link => link.classList.remove('active'));

    // Hide all load more buttons initially
    document.querySelectorAll('.load-more-container').forEach(c => c.style.display = 'none');
    
    const nonInfiniteScrollViews = ['home', 'stats', 'connected-users', 'management'];
    if (nonInfiniteScrollViews.includes(view)) {
        removeInfiniteScroll();
    }
    
    let targetView;

    // Show selected view and set up pagination
    switch (view) {
        case 'home':
            targetView = homeView;
            document.querySelector('.nav-link[data-section="home"]').classList.add('active');
            document.querySelector('.bottom-nav-item[data-section="home"]').classList.add('active');
            await loadDeferredContent();
            break;
        case 'movies':
            targetView = moviesView;
            document.querySelector('.nav-link[data-section="movies"]').classList.add('active');
            document.querySelector('.bottom-nav-item[data-section="movies"]').classList.add('active');
            const moviesData = allContent.filter(item => item.display_options?.main_sections?.includes('movies'));
            await setupContentPagination(moviesData, moviesGrid, document.getElementById('load-more-movies'));
            setupInfiniteScroll(moviesGrid, renderNextContentBatch);
            break;
        case 'series':
            targetView = seriesView;
            document.querySelector('.nav-link[data-section="series"]').classList.add('active');
            document.querySelector('.bottom-nav-item[data-section="series"]').classList.add('active');
            const seriesData = allContent.filter(item => item.display_options?.main_sections?.includes('series'));
            await setupContentPagination(seriesData, seriesGrid, document.getElementById('load-more-series'));
            setupInfiniteScroll(seriesGrid, renderNextContentBatch);
            break;
        case 'animes':
            targetView = animesView;
            document.querySelector('.nav-link[data-section="animes"]').classList.add('active');
            document.querySelector('.bottom-nav-item[data-section="animes"]').classList.add('active');
            const animesData = allContent.filter(item => item.display_options?.main_sections?.includes('animes'));
            await setupContentPagination(animesData, animesGrid, document.getElementById('load-more-animes'));
            setupInfiniteScroll(animesGrid, renderNextContentBatch);
            break;
        case 'doramas':
            targetView = doramasView;
            document.querySelector('.nav-link[data-section="doramas"]').classList.add('active');
            const doramasData = allContent.filter(item => item.display_options?.main_sections?.includes('doramas'));
            await setupContentPagination(doramasData, doramasGrid, document.getElementById('load-more-doramas'));
            setupInfiniteScroll(doramasGrid, renderNextContentBatch);
            break;
        case 'en-estreno':
            targetView = enEstrenoView;
            const enEstrenoData = allContent.filter(item => item.display_options?.home_sections?.includes('estreno')).sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            await setupContentPagination(enEstrenoData, enEstrenoGrid, document.getElementById('load-more-en-estreno'));
            setupInfiniteScroll(enEstrenoGrid, renderNextContentBatch);
            break;
        case 'genre-results':
            targetView = genreResultsView;
            setupInfiniteScroll(genreResultsGrid, renderNextContentBatch);
            // Pagination for this is handled in handleCategoryClick
            break;
        case 'search-results':
            targetView = searchResultsView;
            setupInfiniteScroll(searchResultsGrid, renderNextContentBatch);
            // Pagination for this is handled in handleSearch
            break;
        case 'netflix':
        case 'disney':
        case 'hbo':
        case 'prime':
        case 'paramount':
            targetView = document.getElementById(`${view}-view`);
            const platformGrid = document.getElementById(`${view}-grid`);
            const platformButton = document.getElementById(`load-more-${view}`);
            if (targetView && platformGrid && platformButton) {
                const platformData = allContent.filter(item => item.display_options?.platforms?.includes(view));
                await setupContentPagination(platformData, platformGrid, platformButton);
                setupInfiniteScroll(platformGrid, renderNextContentBatch);
            }
            break;
        case 'stats':
            targetView = statsView;
            loadStatsContent();
            break;
        case 'connected-users':
            targetView = connectedUsersView;
            loadConnectedUsers();
            break;
        case 'management':
            targetView = managementPanel;
            break;
        default:
            targetView = homeView;
            document.querySelector('.nav-link[data-section="home"]').classList.add('active');
            document.querySelector('.bottom-nav-item[data-section="home"]').classList.add('active');
            break;
    }
    
    if (targetView) {
        targetView.classList.add('active');
    }
    currentView = view;
    scrollToTop();
}

// Function to set up and start pagination for a given content set
async function setupContentPagination(data, gridElement, loadMoreButton) {
    if (!gridElement) {
        console.error("Content pagination setup failed: grid element not found.");
        return;
    }
    showSpinner();
    
    currentContentData = shuffleArray(data);
    currentContentGrid = gridElement;

    // Clear previous content and reset page
    currentContentGrid.innerHTML = '';
    contentCurrentPage = 1;

    // Remove the 'Load More' button logic and event listener
    if (loadMoreButton && loadMoreButton.parentElement) {
        loadMoreButton.parentElement.style.display = 'none';
    }

    await renderNextContentBatch(); // Render the first batch
    hideSpinner();
}

// Function to set up infinite scroll for a given grid
function setupInfiniteScroll(gridElement, loadMoreFunction) {
  removeInfiniteScroll(); // Remove any existing listener
  currentScrollListener = throttle(() => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      loadMoreFunction();
    }
  }, 100);
  window.addEventListener('scroll', currentScrollListener);
}

// Function to remove the active infinite scroll listener
function removeInfiniteScroll() {
  if (currentScrollListener) {
    window.removeEventListener('scroll', currentScrollListener);
    currentScrollListener = null;
  }
}

// Function to render the next batch of content items
async function renderNextContentBatch() {
    if (isContentLoadingMore) return;
    isContentLoadingMore = true;

    const startIndex = (contentCurrentPage - 1) * contentItemsPerPage;
    const endIndex = startIndex + contentItemsPerPage;
    const batch = currentContentData.slice(startIndex, endIndex);

    if (batch.length > 0) {
        await renderGridView(currentContentGrid, batch, false); // Append new items
        contentCurrentPage++;
    }

    // Show or hide the 'Load More' button - This logic is no longer needed for infinite scroll
    /*
    if (currentContentLoadMoreBtn && currentContentLoadMoreBtn.parentElement) {
        if (endIndex >= currentContentData.length) {
            currentContentLoadMoreBtn.parentElement.style.display = 'none';
        } else {
            currentContentLoadMoreBtn.parentElement.style.display = 'block';
        }
    }
    */
    
    if (currentContentData.length === 0 && startIndex === 0) {
        currentContentGrid.innerHTML = `<div class="empty-state">${getText('content.noContent')}</div>`;
    }

    isContentLoadingMore = false;
}


function adjustSliders() {
  document.querySelectorAll('.slider-container').forEach(slider => {
    // Ajusta el ancho de las tarjetas según el ancho de la ventana
    const containerWidth = slider.clientWidth;
    const cardWidth = containerWidth < 768 ? 140 : containerWidth < 992 ? 200 : 240;
    
    // Actualiza el estilo de las tarjetas
    slider.querySelectorAll('.content-card').forEach(card => {
      card.style.flexBasis = `${cardWidth - 16}px`; // 16px para márgenes
    });
  });
}

// Load all content
async function loadAllContent() {
    try {
        // Fetch all content from Firestore ONCE and store it globally.
        allContent = await fetchContentFromFirestore();
        
        moviesContent = allContent.filter(item => item.media_type === 'movie');
        seriesContent = allContent.filter(item => item.media_type === 'tv');

        // Render the hero slider with the new async function
        const heroContent = await generateHeroContent();
        renderHeroSlides(heroContent);
        preloadCriticalImages(heroContent);
        
        loadDeferredContent(); 
        renderCategories();
        renderPlatforms();
        
        startHeroSlideshow();
        
    } catch (error) {
        console.error('Error loading content:', error);
        throw error;
    }
}

async function fetchContentFromFirestore(filterOptions = {}) {
    const {
        mediaType,
        limitNumber,
        orderByField = 'imported_at',
        orderByDirection = 'desc',
        arrayContains
    } = filterOptions;

    try {
        let q = collection(db, 'content');
        const constraints = [];

        if (mediaType) {
            constraints.push(where('media_type', '==', mediaType));
        }

        if (arrayContains && arrayContains.field && arrayContains.value) {
            constraints.push(where(arrayContains.field, 'array-contains', arrayContains.value));
        }

        constraints.push(orderBy(orderByField, orderByDirection));

        if (limitNumber) {
            constraints.push(limit(limitNumber));
        }

        const finalQuery = query(q, ...constraints);
        const snapshot = await getDocs(finalQuery);
        return snapshot.docs.map(doc => doc.data());

    } catch (error) {
        console.error("Error fetching content from Firestore:", error);
        if (error.code === 'failed-precondition') {
            console.error("This error may be caused by a missing composite index in Firestore. Please check the Firebase console to create the required index based on the error message.");
        }
        return [];
    }
}

async function loadDeferredContent() {
    try {
        const { enEstreno, recienAgregado, peliculasPopulares, seriesPopulares } = webSettings.homepageSections;

        // "En Estreno" - Filter from allContent
        const enEstrenoContent = allContent
            .filter(item => item.display_options?.home_sections?.includes('estreno'))
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        await renderContentSlider(enEstrenoSlider, enEstrenoContent.slice(0, enEstreno));

        // "Recién Agregado" - Filter from allContent
        const recentlyAddedContent = allContent
            .filter(item => item.display_options?.home_sections?.includes('agregado'))
            .sort((a, b) => (b.imported_at?.seconds || 0) - (a.imported_at?.seconds || 0));
        await renderContentSlider(document.getElementById('recently-added-slider'), recentlyAddedContent.slice(0, recienAgregado));
        
        // "Trending" (Top 10) - This section remains fixed to 10
        if (currentUser) {
            const trending = await fetchTrendingPostersFromFirebase();
            await renderContentSlider(trendingSlider, trending);
        } else {
            const randomTop10 = shuffleArray(allContent).slice(0, 10);
            const formattedRandomTop10 = randomTop10.map(item => ({
                posterId: item.id, mediaType: item.media_type, title: item.title || item.name,
                posterPath: item.poster_path, vote_average: item.vote_average,
                release_date: item.release_date || item.first_air_date,
            }));
            await renderContentSlider(trendingSlider, formattedRandomTop10);
        }
        
        // "Popular Movies" (random slice from all movies)
        await renderContentSlider(moviesSlider, shuffleArray(moviesContent).slice(0, peliculasPopulares));
        
        // "Popular Series" (random slice from all series)
        await renderContentSlider(seriesSlider, shuffleArray(seriesContent).slice(0, seriesPopulares));
        
    } catch (error) {
        console.error('Error loading deferred content:', error);
    }
}

function preloadCriticalImages(content) {
  if (!content || content.length === 0) return;
  
  const imagesToPreload = content.slice(0, 3);
  
  imagesToPreload.forEach(item => {
    if (item.backdrop_path) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `${IMG_BASE_URL}/original${item.backdrop_path}`;
      document.head.appendChild(link);
    }
    
    if (item.poster_path) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `${IMG_BASE_URL}/w500${item.poster_path}`;
      document.head.appendChild(link);
    }
  });
}

    async function renderContentSlider(sliderElement, content) {
      if (sliderElement.id === 'trending-slider') {
          await renderTrendingSlider(sliderElement, content);
          return;
      }

      sliderElement.innerHTML = '';

      const translatedContent = await translateContentToDisplayLanguage(content);

      if (translatedContent.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
          <i class="fas fa-film empty-icon"></i>
          <h3 class="empty-title">${getText('content.emptyState.title')}</h3>
          <p class="empty-text">${getText('content.emptyState.text')}</p>
        `;
        sliderElement.appendChild(emptyState);
        return;
      }

      translatedContent.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.dataset.id = item.id;
        card.dataset.type = item.media_type;

        const posterPath = item.poster_path 
          ? `${IMG_BASE_URL}/w500${item.poster_path}` 
          : 'https://via.placeholder.com/300x450?text=No+Image';

        const title = item.title || item.name || getText('content.noTitle');
        const year = (item.release_date || item.first_air_date || '').split('-')[0] || getText('content.notAvailable');
        const rating = item.vote_average ? item.vote_average.toFixed(1) : getText('content.notAvailable');
        const type = item.media_type === 'movie' ? getText('content.type.movie') : getText('content.type.series');

        card.innerHTML = `
          <img src="${posterPath}" alt="${title}" class="card-poster">
          <div class="card-rating">${rating}</div>
          <div class="card-badge">${type}</div>
          ${sliderElement.id === 'en-estreno-slider' ? '<div class="card-estreno-diagonal"></div>' : ''}
          ${sliderElement.id === 'recently-added-slider' ? `<div class="card-nuevo-pegatina">${getText('content.newSticker')}</div>` : ''}
          <div class="card-overlay">
            <h3 class="card-title">${title}</h3>
            <div class="card-info">
              <span>${year}</span>
              <span>${type}</span>
            </div>
            <div class="card-actions">
              <button class="card-btn play-btn" title="${getText('actions.watchNow')}">
                <i class="fas fa-play"></i>
              </button>
              <button class="card-btn info-btn" title="${getText('actions.info')}">
                <i class="fas fa-info"></i>
              </button>
              ${sliderElement.id === 'continue-watching-slider' ? `
                <button class="card-btn remove-btn" title="${getText('actions.removeFromList')}">
                  <i class="fas fa-times"></i>
                </button>
              ` : ''}
            </div>
          </div>
        `;
        
        // Add event listeners 
        card.querySelector('.play-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          showMovieDetailsModal(item.id, item.media_type);
        });

        card.querySelector('.info-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          showMovieDetailsModal(item.id, item.media_type);
        });

        if (sliderElement.id === 'continue-watching-slider') {
          card.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromContinuarViendo(item.id);
            card.remove();
            
            // Check if continue watching is empty
            if (continueWatchingContent.length === 0) {
              continueWatchingSection.style.display = 'none';
            }
          });
        }

        card.addEventListener('click', () => {
          showMovieDetailsModal(item.id, item.media_type);
        });

        sliderElement.appendChild(card);
      });
    }

async function renderTrendingSlider(sliderElement, content) {
    sliderElement.innerHTML = '';

    const translatedContent = await translateContentToDisplayLanguage(content);

    if (translatedContent.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-chart-line empty-icon"></i>
            <h3 class="empty-title">${getText('trending.empty.title')}</h3>
            <p class="empty-text">${getText('trending.empty.text')}</p>
        `;
        sliderElement.appendChild(emptyState);
        return;
    }

    translatedContent.forEach((item, index) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'trending-card-container'; // Contenedor para el número y el poster

        // Crear un espacio para el número
        const numberSpace = document.createElement('div');
        numberSpace.className = 'trending-number';
        numberSpace.textContent = index + 1; // Asignar el número del 1 al 10

        const card = document.createElement('div');
        card.className = 'content-card';
        card.dataset.id = item.posterId; 
        card.dataset.type = item.mediaType; 

        const posterPath = item.posterPath 
            ? `${IMG_BASE_URL}/w500${item.posterPath}` 
            : 'https://via.placeholder.com/300x450?text=No+Image';

        const title = item.title || item.name || getText('content.noTitle');
        const year = (item.release_date || item.first_air_date || '').split('-')[0] || getText('content.notAvailable'); 
        const rating = item.vote_average ? item.vote_average.toFixed(1) : getText('content.notAvailable');
        const type = item.mediaType === 'movie' ? getText('content.type.movie') : getText('content.type.series');

        card.innerHTML = `
            <img src="${posterPath}" alt="${title}" class="card-poster">
            <div class="card-rating">${rating}</div>
            <div class="card-badge">${type}</div>
            <div class="card-overlay">
                <h3 class="card-title">${title}</h3>
                <div class="card-info">
                    <span>${year}</span>
                    <span>${type}</span>
                </div>
                <div class="card-actions">
                    <button class="card-btn play-btn" title="${getText('actions.watchNow')}">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="card-btn info-btn" title="${getText('actions.info')}">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            </div>
        `;
        
        card.querySelector('.play-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          showMovieDetailsModal(item.posterId, item.mediaType);
        });

        card.querySelector('.info-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          showMovieDetailsModal(item.posterId, item.mediaType);
        });

        card.addEventListener('click', () => {
          showMovieDetailsModal(item.posterId, item.mediaType);
        });

        cardContainer.appendChild(numberSpace);
        cardContainer.appendChild(card);
        sliderElement.appendChild(cardContainer);
    });
}


function throttle(callback, delay = 100) {
  let lastCall = 0;
  
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    
    lastCall = now;
    callback(...args);
  };
}

function debounce(callback, delay = 300) {
  let timer;
  
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

async function renderGridView(gridElement, content, clearExisting = true) {
  if (clearExisting) {
    gridElement.innerHTML = '';
  }

  const translatedContent = await translateContentToDisplayLanguage(content);

  if (translatedContent.length === 0 && clearExisting) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-film empty-icon"></i>
      <h3 class="empty-title">${getText('content.emptyState.title')}</h3>
      <p class="empty-text">${getText('content.emptyState.text')}</p>
    `;
    gridElement.appendChild(emptyState);
    return;
  }

  translatedContent.forEach(item => {
    const card = document.createElement('div');
    card.className = 'grid-card';
    card.dataset.id = item.id;
    card.dataset.type = item.media_type;

    const posterPath = item.poster_path 
      ? `${IMG_BASE_URL}/w500${item.poster_path}`
      : 'https://via.placeholder.com/300x450?text=No+Image';
    
    const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDQiPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjQiIGZpbGw9IiMzMzMiLz48L2Z2Zz4=';

    const title = item.title || item.name || getText('content.noTitle');
    const year = (item.release_date || item.first_air_date || '').split('-')[0] || getText('content.notAvailable');
    const rating = item.vote_average ? item.vote_average.toFixed(1) : getText('content.notAvailable');
    const type = item.media_type === 'movie' ? getText('content.type.movie') : getText('content.type.series');

    card.innerHTML = `
      <img 
        src="${placeholderSvg}" 
        data-src="${posterPath}" 
        alt="${title}" 
        class="grid-poster lazy"
        loading="lazy"
      >
      <div class="grid-rating">${rating}</div>
      <div class="grid-badge">${type}</div>
      <div class="grid-info">
        <h3 class="grid-title">${title}</h3>
        <div class="grid-meta">
          <span>${year}</span>
          <span>${type}</span>
        </div>
      </div>
      <div class="grid-actions">
        <button class="grid-btn play-btn" title="${getText('actions.watchNow')}">
          <i class="fas fa-play"></i>
        </button>
        <button class="grid-btn info-btn" title="${getText('actions.info')}">
          <i class="fas fa-info"></i>
        </button>
        ${gridElement.id === 'profile-my-list-grid' ? `
          <button class="grid-btn remove-btn" title="${getText('actions.removeFromList')}">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
      </div>
    `;

    card.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showMovieDetailsModal(item.id, item.media_type);
    });

    card.querySelector('.info-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showMovieDetailsModal(item.id, item.media_type);
    });

    if (gridElement.id === 'profile-my-list-grid') {
      card.querySelector('.remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromMyList(item.id);
        card.remove();
      });
    }

    card.addEventListener('click', () => {
      showMovieDetailsModal(item.id, item.media_type);
    });

    gridElement.appendChild(card);
  });
  
  initLazyLoading();
}

    function renderHeroSlides(slides) {
      hero.innerHTML = '';
      
      slides.forEach((slide, index) => {
        const isActive = index === 0 ? 'active' : '';
        const slideElement = document.createElement('div');
        slideElement.className = `hero-slide ${isActive}`;
        slideElement.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${slide.backdrop_path}')`;
        
        const description = slide.overview || 
                           (slide.media_type === 'movie' ? 
                            getText('hero.movieDescription') : 
                            getText('hero.seriesDescription'));
        
        slideElement.innerHTML = `
          <div class="hero-overlay">
            <div class="hero-content">
              <h2 class="hero-title">${slide.title || slide.name}</h2>
              <p class="hero-description">${description.substring(0, 120)}${description.length > 120 ? '...' : ''}</p> 
              <div class="hero-buttons">
                <button class="btn btn-secondary hero-add-list-btn" data-id="${slide.id}" data-type="${slide.media_type}" title="${getText('actions.addToList')}">
                  <i class="fas fa-plus"></i>${getText('actions.list')}
                </button>
                <button class="btn btn-primary hero-play-btn" data-id="${slide.id}" data-type="${slide.media_type}" title="${getText('actions.watchNow')}">
                  <i class="fas fa-play"></i> ${getText('actions.watchNow')}
                </button>
                <button class="btn btn-secondary hero-info-btn" data-id="${slide.id}" data-type="${slide.media_type}" title="${getText('actions.moreInfo')}">
                  <i class="fas fa-info-circle"></i> ${getText('actions.info')}
                </button>
              </div>
            </div>
          </div>
        `;
        
        hero.appendChild(slideElement);
      });
      
      const heroNav = document.createElement('div');
      heroNav.className = 'hero-nav';
      heroNav.id = 'hero-nav';
      
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `hero-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => goToHeroSlide(index));
        heroNav.appendChild(dot);
      });
      
      hero.appendChild(heroNav);
      
document.querySelectorAll('.hero-play-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const id = parseInt(this.dataset.id);
    const type = this.dataset.type;
    showMovieDetailsModal(id, type);
  });
});

      document.querySelectorAll('.hero-info-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.dataset.id;
          const type = this.dataset.type;
          const slide = slides.find(s => s.id.toString() === id); 
          if (slide) {
            showMovieDetailsModal(slide.id, slide.media_type);
          }
        });
      });

      document.querySelectorAll('.hero-add-list-btn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
          const id = parseInt(this.dataset.id);
          const type = this.dataset.type;
          const buttonElement = e.currentTarget; 
          
          try {
            const itemDetails = await fetchContentByIds([id], type);
            if (itemDetails && itemDetails.length > 0) {
              await saveToMyList(itemDetails[0], buttonElement);
            } else {
              // Handle error on the button itself
              buttonElement.innerHTML = `<i class="fas fa-times"></i> ${getText('actions.error')}`;
              setTimeout(() => {
                  buttonElement.innerHTML = `<i class="fas fa-plus"></i>${getText('actions.list')}`;
              }, 2500);
            }
          } catch (error) {
            console.error('Error adding to list:', error);
            buttonElement.innerHTML = `<i class="fas fa-times"></i> ${getText('actions.error')}`;
            setTimeout(() => {
                buttonElement.innerHTML = `<i class="fas fa-plus"></i>${getText('actions.list')}`;
            }, 2500);
          }
        });
      });
      
      // Update global variables
      heroSlides = document.querySelectorAll('.hero-slide');
      heroDots = document.querySelectorAll('.hero-dot');
    }

// Navigate slider
function navigateSlider(slider, direction) {
  const cardWidth = 240;
  const scrollAmount = cardWidth * 3;
  
  if (direction === 'prev') {
    slider.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  } else {
    slider.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
}

function startHeroSlideshow() {
  clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    goToHeroSlide((currentHeroSlide + 1) % heroSlides.length);
  }, 8000);
}

function goToHeroSlide(index) {
  heroSlides[currentHeroSlide].classList.remove('active');
  heroDots[currentHeroSlide].classList.remove('active');
  
  currentHeroSlide = index;
  
  if (heroSlides[currentHeroSlide].dataset.background) {
    heroSlides[currentHeroSlide].style.backgroundImage = heroSlides[currentHeroSlide].dataset.background;
    heroSlides[currentHeroSlide].removeAttribute('data-background');
  }
  
  heroSlides[currentHeroSlide].classList.add('active');
  heroDots[currentHeroSlide].classList.add('active');
  
  startHeroSlideshow();
}

function toggleSearch() {
  searchInput.classList.toggle('active');
  if (searchInput.classList.contains('active')) {
    setTimeout(() => searchInput.focus(), 300);
  }
}

// Handle search
function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    navigateToView('search-results');
    searchResultsTitle.textContent = `${getText('search.resultsFor')} "${query}"`;
    
    const normalizedQuery = normalizeString(query);
    const searchResults = allContent.filter(item => {
        const title = normalizeString(item.title || item.name || '');
        const originalTitle = normalizeString(item.original_title || item.original_name || '');
        return title.includes(normalizedQuery) || originalTitle.includes(normalizedQuery);
    });

    setupContentPagination(searchResults, searchResultsGrid, document.getElementById('load-more-search'));
}


function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function handleCategoryClick(e) {
    const genreId = parseInt(e.currentTarget.dataset.genre);
    const genreName = e.currentTarget.dataset.name;
    
    navigateToView('genre-results');
    genreTitle.textContent = `${getText('genres.genreLabel')}: ${genreName}`;
    showSpinner();
    try {
        const q = query(collection(db, "content"), where("genres", "array-contains", genreId));
        const snapshot = await getDocs(q);
        const genreResults = snapshot.docs.map(doc => doc.data());

        setupContentPagination(genreResults, genreResultsGrid, document.getElementById('load-more-genre'));
        
    } catch (error) {
        console.error('Error fetching genre content:', error);
        genreResultsGrid.innerHTML = `<div class="empty-state error">${getText('genres.loadError')}</div>`;
    } finally {
        hideSpinner();
    }
}

  async function handleServiceClick(e) {
      const service = e.currentTarget.dataset.service;

      serviceItems.forEach(item => item.classList.remove('active'));

      if (currentService === service) {
          resetServices();
          return;
      }

      e.currentTarget.classList.add('active');
      currentService = service;
      navigateToView(service);
      servicesBackBtn.style.display = 'block';
  }

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  // Scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function checkWelcomePopup() {
    const dontShowAgain = localStorage.getItem('dontShowPopupAgain');
    
    if (dontShowAgain !== 'true') {
      welcomePopup.style.display = 'flex';
    }
  }

  // Handle close popup
  function handleClosePopup() {
    welcomePopup.style.display = 'none';
    
    if (dontShowAgain.checked) {
      localStorage.setItem('dontShowPopupAgain', 'true');
    }
  }

  // Load continue watching content
  async function loadContinuarViendo() {
    if (!currentUser) return [];
    
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, "users", currentUser.id));
      
      if (userDoc.exists() && userDoc.data().myList) {
        return userDoc.data().myList;
      }
      
      return [];
    } catch (error) {
      console.error("Error loading continue watching:", error);
      return [];
    }
  }

  async function saveToContinuarViendo(item) {
    if (!currentUser) return;
    
    try {
      // Update poster click count
      await updatePosterClickCount(item.id, item.media_type, item.title || item.name, item.poster_path, item.vote_average);

      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, "users", currentUser.id));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let myList = userData.myList || [];
        
        // Check if item already exists
        const existingIndex = myList.findIndex(content => content.id === item.id);
        
        if (existingIndex !== -1) {
          // Update last visited date
          myList[existingIndex].lastVisited = new Date().toISOString();
        } else {
          // Add new item
          myList.push({
            ...item,
            lastVisited: new Date().toISOString()
          });
        }
        
        // Update user document in Firestore
        await updateDoc(doc(db, "users", currentUser.id), {
          myList: myList
        });
      }
    } catch (error) {
      console.error("Error saving to continue watching:", error);
    }
  }

async function removeFromMyList(itemId) {
  if (!currentUser) return;
  
  try {
    const userDoc = await getDoc(doc(db, "users", currentUser.id));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      let myList = userData.myList || [];
      
      myList = myList.filter(item => item.id !== itemId);
      
      await updateDoc(doc(db, "users", currentUser.id), {
        myList: myList
      });
     
    }
  } catch (error) {
    console.error("Error removing from my list:", error);
    showToast(getText('toast.removeFromListError'), 'error');
  }
}

async function saveToMyList(item, btnElement = null) {
  if (!currentUser) {
    showMessageModal(getText('user.profile.restrictedAccess'), getText('user.profile.loginRequired'), 'info');
    showAuthModal();
    return;
  }

  const originalBtnHtml = btnElement ? btnElement.innerHTML : '';
  if (btnElement) {
    btnElement.disabled = true;
    btnElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${getText('actions.saving')}`;
  }

  try {
    await updatePosterClickCount(item.id, item.media_type, item.title || item.name, item.poster_path, item.vote_average);

    const userRef = doc(db, "users", currentUser.id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      let myList = userData.myList || [];
      const existingIndex = myList.findIndex(content => content.id === item.id && content.media_type === item.media_type);

      if (existingIndex === -1) {
        myList.push({
          id: item.id,
          media_type: item.media_type,
          title: item.title || item.name,
          poster_path: item.poster_path,
          release_date: item.release_date || item.first_air_date,
          vote_average: item.vote_average,
          lastVisited: new Date().toISOString()
        });
        await updateDoc(userRef, { myList: myList });
        if (btnElement) {
          btnElement.innerHTML = `<i class="fas fa-check"></i> ${getText('actions.added')}`;
        } else {
          showToast(getText('toast.addedToList'), 'success');
        }
      } else {
        if (btnElement) {
          btnElement.innerHTML = `<i class="fas fa-info-circle"></i> ${getText('actions.alreadyInList')}`;
        } else {
          showToast(getText('toast.alreadyInList'), 'info');
        }
      }
    }
  } catch (error) {
    console.error("Error saving to my list:", error);
    if (btnElement) {
      btnElement.innerHTML = `<i class="fas fa-times"></i> ${getText('actions.error')}`;
    } else {
      showToast(getText('toast.addToListError'), 'error');
    }
  } finally {
    if (btnElement) {
      setTimeout(() => {
        btnElement.disabled = false;
        btnElement.innerHTML = originalBtnHtml;
      }, 2500); // Revert button after 2.5 seconds
    }
  }
}

  function showSpinner() {
    spinnerContainer.style.display = 'flex';
  }

  function hideSpinner() {
    spinnerContainer.style.display = 'none';
  }

  async function updatePosterClickCount(posterId, mediaType, title, posterPath, voteAverage) {
    try {
      const posterRef = doc(db, "posterClicks", String(posterId));
      const posterDoc = await getDoc(posterRef);

      if (posterDoc.exists()) {
        // If poster exists, increment clickCount
        await updateDoc(posterRef, {
          clickCount: posterDoc.data().clickCount + 1,
          lastClicked: serverTimestamp(),
          mediaType: mediaType,
          title: title,
          posterPath: posterPath,
          vote_average: voteAverage
        });
      } else {
        // If poster does not exist, create it with clickCount = 1
        await setDoc(posterRef, {
          posterId: String(posterId), // Store as string
          mediaType: mediaType,
          title: title,
          posterPath: posterPath,
          vote_average: voteAverage,
          clickCount: 1,
          lastClicked: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error updating poster click count:", error);
    }
  }

  async function fetchTrendingPostersFromFirebase() {
    try {
      const q = query(
        collection(db, "posterClicks"),
        orderBy("clickCount", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const trendingData = [];
      querySnapshot.forEach((doc) => {
        trendingData.push(doc.data());
      });
      trendingContent = trendingData; 
      return trendingData;
    } catch (error) {
      console.error("Error fetching trending posters from Firebase:", error);
      return [];
    }
  }

async function fetchContentByIds(ids, type) {
  if (!ids || ids.length === 0) return [];
  
  try {
    const promises = ids.map(id => {
      const cacheKey = `${type}_${id}`;
      
      if (apiCache.has(cacheKey)) {
        const cachedData = apiCache.get(cacheKey);
        const now = new Date().getTime();
        
        if (now - cachedData.timestamp < 30 * 60 * 1000) {
          return cachedData.data;
        }
      }
      
      return fetch(`${API_BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=${webSettings.importLanguage}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching ${type} ${id}`);
          }
          return response.json();
        })
        .then(data => {
          // Almacena en caché con timestamp
          apiCache.set(cacheKey, {
            data: {
              ...data,
              media_type: type
            },
            timestamp: new Date().getTime()
          });
          
          return {
            ...data,
            media_type: type
          };
        })
        .catch(error => {
          console.error(error);
          return null;
        });
    });
    
    const results = await Promise.all(promises);
    return results.filter(item => item !== null);
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error);
    return [];
  }
}

async function fetchHeroDetailsInEnglish(contentItems) {
    const promises = contentItems.map(item => {
        const url = `${API_BASE_URL}/${item.media_type}/${item.id}?api_key=${API_KEY}&language=en-US`;
        return fetch(url).then(res => res.json());
    });

    try {
        const results = await Promise.all(promises);
        // Map the results back, keeping the original item structure but overriding title/overview
        return contentItems.map((originalItem, index) => {
            const englishDetails = results[index];
            if (englishDetails && englishDetails.success !== false) {
                return {
                    ...originalItem, // Keep original data like IDs, paths etc.
                    title: englishDetails.title || englishDetails.name, // Use English title/name
                    name: englishDetails.name || englishDetails.title,
                    overview: englishDetails.overview, // Use English overview
                };
            }
            return originalItem; // Fallback to original if API call fails
        });
    } catch (error) {
        console.error("Failed to fetch hero details in English, falling back to original:", error);
        return contentItems;
    }
}

async function translateContentToDisplayLanguage(contentItems) {
    if (webSettings.displayLanguage !== 'en-US' || !contentItems || contentItems.length === 0) {
        return contentItems;
    }

    const promises = contentItems.map(item => {
        // Some items might be from Firestore (with id) and some from TMDB API (with posterId)
        const itemId = item.id || item.posterId;
        const mediaType = item.media_type || item.mediaType;

        if (!itemId || !mediaType) {
            return Promise.resolve(item); // Return original item if no ID or type
        }

        const url = `${API_BASE_URL}/${mediaType}/${itemId}?api_key=${API_KEY}&language=en-US`;
        return fetch(url)
            .then(res => {
                if (!res.ok) {
                    // If fetch fails, return the original item
                    console.warn(`Could not fetch English details for ${mediaType} ${itemId}. Status: ${res.status}`);
                    return item;
                }
                return res.json();
            })
            .then(englishDetails => {
                if (englishDetails && englishDetails.success !== false) {
                    return {
                        ...item, // Keep original data
                        title: englishDetails.title || englishDetails.name,
                        name: englishDetails.name || englishDetails.title,
                        overview: englishDetails.overview,
                        poster_path: englishDetails.poster_path,
                    };
                }
                return item; // Fallback to original if API call fails
            })
            .catch(error => {
                console.error(`Error fetching English details for ${mediaType} ${itemId}:`, error);
                return item; // Fallback to original on error
            });
    });

    try {
        const translatedItems = await Promise.all(promises);
        return translatedItems;
    } catch (error) {
        console.error("Failed to translate content to English, returning original content.", error);
        return contentItems;
    }
}

async function generateHeroContent() {
    try {
        const { posters, random, recent } = webSettings.heroSlider;

        const recentQuery = query(
            collection(db, 'content'),
            orderBy('imported_at', 'desc'),
            limit(recent * 2) // Fetch more to ensure we get enough with backdrop_path
        );
        const recentSnapshot = await getDocs(recentQuery);
        const recentItems = recentSnapshot.docs.map(doc => doc.data());
        
        const recentContent = recentItems.filter(item => item.backdrop_path).slice(0, recent);
        const recentIds = recentContent.map(item => item.id);

        const randomCandidates = allContent.filter(item => 
            item.backdrop_path &&
            !recentIds.includes(item.id)
        );

        const randomContent = shuffleArray(randomCandidates).slice(0, random);

        let finalHeroContentSource = shuffleArray([...recentContent, ...randomContent]).slice(0, posters);
        
		if (webSettings.displayLanguage === 'en-US') {
            const englishContent = await fetchHeroDetailsInEnglish(finalHeroContentSource);
            return englishContent;
        }

        return finalHeroContentSource;
        
    } catch (error) {
        console.error('Error generating hero content, using a simple random fallback:', error);
        const allCandidates = allContent.filter(item => item.backdrop_path);
        return shuffleArray(allCandidates).slice(0, webSettings.heroSlider.posters);
    }
}

  async function fetchAndDisplayAnimes() {
    try {
      // Show spinner
      showSpinner();
      
      // Fetch anime content
      const animeMovies = await fetchContentByIds(contentIds.animesMovieIds, 'movie');
      const animeSeries = await fetchContentByIds(contentIds.animesSeriesIds, 'tv');
      
      // Combine and shuffle
      const animeContent = shuffleArray([...animeMovies, ...animeSeries]);
      
      // Render in grid view
      renderGridView(animesGrid, animeContent);
    } catch (error) {
      console.error('Error fetching anime content:', error);
      renderGridView(animesGrid, []);
    } finally {
      // Hide spinner
      hideSpinner();
    }
  }

  async function fetchAndDisplayDoramas() {
    try {
      // Show spinner
      showSpinner();
      
      // Fetch dorama content
      const doramaMovies = await fetchContentByIds(contentIds.doramasMovieIds, 'movie');
      const doramaSeries = await fetchContentByIds(contentIds.doramasSeriesIds, 'tv'); // Fetch series as well
      
      // Combine and shuffle
      const doramaContent = shuffleArray([...doramaMovies, ...doramaSeries]);
      
      // Render in grid view
      renderGridView(doramasGrid, doramaContent);
    } catch (error) {
      console.error('Error fetching dorama content:', error);
      renderGridView(doramasGrid, []);
    } finally {
      // Hide spinner
      hideSpinner();
    }
  }

function playInIframe(url) {
    const videoContainer = document.getElementById('modal-video-container');
    const iframe = document.getElementById('video-player-iframe');
    if (!videoContainer || !iframe) return;
    
    iframe.src = url; 
    
    videoContainer.style.display = 'block';
}

function renderFirestoreSeriesAccordion(seasons) {
    const optionsContainer = document.getElementById('media-options-container');
    if (!optionsContainer) return;

    if (!seasons || Object.keys(seasons).length === 0) {
        optionsContainer.innerHTML = `<p class="empty-text">${getText('details.noSeasons')}</p>`;
        return;
    }

    // Also check for episodes to avoid rendering empty seasons
    const sortedSeasons = Object.values(seasons)
        .filter(season => season.season_number > 0 && season.episodes && Object.keys(season.episodes).length > 0)
        .sort((a, b) => a.season_number - b.season_number);

    if (sortedSeasons.length === 0) {
        optionsContainer.innerHTML = `<p class="empty-text">${getText('details.noSeasons')}</p>`;
        return;
    }
    
    const defaultSeason = sortedSeasons[0];

    const dropdownHTML = `
        <div class="season-selector">
            <button class="season-select-btn">
                <span>${getText('details.season')} ${defaultSeason.season_number}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <ul class="season-dropdown" style="display: none;">
                ${sortedSeasons.map(season => `
                    <li data-season-number="${season.season_number}">${getText('details.season')} ${season.season_number}</li>
                `).join('')}
            </ul>
        </div>
        <div id="episodes-wrapper">
             ${renderFirestoreEpisodes(defaultSeason.episodes)}
        </div>
    `;

    optionsContainer.innerHTML = dropdownHTML;
    attachAccordionEventListeners(sortedSeasons);
}

function renderFirestoreEpisodes(episodes) {
    if (!episodes || Object.keys(episodes).length === 0) {
        return `<p class="empty-text" style="font-size: 0.9rem; padding: 10px;">${getText('details.noEpisodes')}</p>`;
    }

    const sortedEpisodes = Object.values(episodes)
        .filter(ep => ep.video_url) // Filtrar episodios que tienen video_url
        .sort((a, b) => a.episode_number - b.episode_number);

    if (sortedEpisodes.length === 0) {
        return `<p class="empty-text" style="font-size: 0.9rem; padding: 10px;">${getText('details.noEpisodes')}</p>`;
    }

    return `<ul class="episodes-list">${sortedEpisodes.map(ep => `
        <li class="episode-item" data-url="${ep.video_url}">
            ${ep.episode_number}
        </li>`).join('')}</ul>`;
}

function attachAccordionEventListeners(seasons) {
    const seasonSelectBtn = document.querySelector('.season-select-btn');
    const seasonDropdown = document.querySelector('.season-dropdown');
    const episodesWrapper = document.getElementById('episodes-wrapper');

    if (!seasonSelectBtn || !seasonDropdown) return;

    seasonSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = seasonDropdown.style.display === 'block';
        seasonDropdown.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!seasonSelectBtn.contains(e.target) && !seasonDropdown.contains(e.target)) {
            seasonDropdown.style.display = 'none';
        }
    });

    seasonDropdown.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const seasonNumber = parseInt(item.dataset.seasonNumber, 10);
            const selectedSeason = seasons.find(s => s.season_number === seasonNumber);
            
            if (selectedSeason) {
                seasonSelectBtn.querySelector('span').textContent = `${getText('details.season')} ${seasonNumber}`;
                episodesWrapper.innerHTML = renderFirestoreEpisodes(selectedSeason.episodes);
                
                // Re-attach listeners for the new episode items
                episodesWrapper.querySelectorAll('.episode-item').forEach(epItem => {
                    epItem.addEventListener('click', () => {
                        if (epItem.dataset.url) {
                           // Remove active class from all other episodes
                           episodesWrapper.querySelectorAll('.episode-item').forEach(i => i.classList.remove('active'));
                           // Add active class to the clicked one
                           epItem.classList.add('active');
                           playInIframe(epItem.dataset.url);
                        }
                    });
                });
            }
            seasonDropdown.style.display = 'none';
        });
    });

    episodesWrapper.querySelectorAll('.episode-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.url) {
                // Remove active class from all other episodes
                episodesWrapper.querySelectorAll('.episode-item').forEach(i => i.classList.remove('active'));
                // Add active class to the clicked one
                item.classList.add('active');
                playInIframe(item.dataset.url);
            }
        });
    });
}

async function showMovieDetailsModal(id, type) {
    const modalContainer = document.getElementById('movie-details-modal-container');
    const isModalAlreadyOpen = modalContainer.querySelector('.movie-details-modal');

    if (!isModalAlreadyOpen) {
        modalContainer.innerHTML = `
            <div class="movie-details-modal">
                <div class="modal-overlay"></div>
                <div class="modal-container">
                    <div class="modal-content-wrapper"></div>
                    <button class="modal-close" id="close-details-modal"><i class="fas fa-times"></i></button>
                </div>
            </div>`;
        
        const closeModal = () => {
            modalContainer.innerHTML = '';
            const iframe = document.getElementById('video-player-iframe');
            if (iframe) iframe.src = 'about:blank';
        };

        modalContainer.querySelector('#close-details-modal').addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-overlay').addEventListener('click', closeModal);
    }

    const contentWrapper = modalContainer.querySelector('.modal-content-wrapper');
    contentWrapper.innerHTML = `<div class="modal-loading"><div class="spinner"></div><p>${getText('modal.loading')}</p></div>`;

    try {
        const displayLanguage = webSettings.displayLanguage || 'es-MX';
        const response = await fetch(`${API_BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=${displayLanguage}&append_to_response=credits`);
        
        if (!response.ok) {
            const contentRef = doc(db, 'content', String(id));
            const contentDoc = await getDoc(contentRef);
            if (!contentDoc.exists()) throw new Error(getText('modal.contentNotFound'));
            
            const data = contentDoc.data();
            await updatePosterClickCount(data.id, type, data.title || data.name, data.poster_path, data.vote_average);
            await renderModalContent(data, type);
        } else {
            const data = await response.json();
            await updatePosterClickCount(data.id, type, data.title || data.name, data.poster_path, data.vote_average);
            await renderModalContent(data, type);
        }
    } catch (error) {
        console.error('Error showing movie details:', error);
        if (contentWrapper) {
            contentWrapper.innerHTML = `<div class="modal-error"><h3>${getText('modal.errorTitle')}</h3><p>${error.message}</p></div>`;
        }
    }
}

async function renderModalContent(data, type) {
    const modalContainer = document.getElementById('movie-details-modal-container');
    const contentRef = doc(db, 'content', String(data.id));
    const contentDoc = await getDoc(contentRef);
    const firestoreData = contentDoc.exists() ? contentDoc.data() : {};

    const title = data.title || data.name || getText('content.noTitle');
    const posterPath = data.poster_path ? `${IMG_BASE_URL}/w500${data.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
    const backdropPath = data.backdrop_path ? `${IMG_BASE_URL}/original${data.backdrop_path}` : '';
    const overview = data.overview || getText('details.noDescription');
    
    const genres = data.genres?.map(g => g.name).join(', ') || getText('content.notAvailable');
    
    let director = getText('content.notAvailable');
    if (data.credits) {
        if (type === 'movie') {
            const directorInfo = data.credits.crew.find(person => person.job === 'Director');
            if (directorInfo) director = directorInfo.name;
        } else if (type === 'tv' && data.created_by?.length > 0) {
            director = data.created_by.map(creator => creator.name).join(', ');
        }
    }

    const cast = data.credits?.cast.slice(0, 6).map(actor => actor.name).join(', ') || getText('content.notAvailable');

    const nextEpisodeNote = firestoreData.next_episode_note || '';
    const noteHtml = nextEpisodeNote
        ? `<div class="next-episode-note">
             <i class="fas fa-info-circle"></i> ${nextEpisodeNote}
           </div>`
        : '';

    let relatedContent = [];
    if (type === 'movie') {
        relatedContent = shuffleArray(allContent.filter(item => item.media_type === 'movie' && item.id !== data.id)).slice(0, 10);
    } else { // type === 'tv'
        relatedContent = shuffleArray(allContent.filter(item => item.media_type === 'tv' && item.id !== data.id)).slice(0, 10);
    }

    const relatedContentMobile = relatedContent.slice(0, 6);

    const relatedContentGridHtml = relatedContent.map(item => `
        <div class="grid-card related-card" data-id="${item.id}" data-type="${item.media_type}">
            <img src="${item.poster_path ? `${IMG_BASE_URL}/w500${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${item.title || item.name}" class="grid-poster">
                <div class="card-rating">${item.vote_average ? item.vote_average.toFixed(1) : getText('content.notAvailable')}</div>
        </div>
    `).join('');

    const relatedContentGridHtmlMobile = relatedContentMobile.map(item => `
        <div class="grid-card related-card" data-id="${item.id}" data-type="${item.media_type}">
            <img src="${item.poster_path ? `${IMG_BASE_URL}/w500${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${item.title || item.name}" class="grid-poster">
                <div class="card-rating">${item.vote_average ? item.vote_average.toFixed(1) : getText('content.notAvailable')}</div>
        </div>
    `).join('');

    let modalContentHtml = `
        ${backdropPath ? `<div class="modal-backdrop" style="background-image: url('${backdropPath}')"><div class="modal-backdrop-overlay"></div></div>` : ''}
        <div class="modal-content-inner">
            <div class="modal-main-content">
                <div id="modal-video-container" class="modal-video-container">
                    <iframe id="video-player-iframe" width="100%" src="" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div class="related-content-container related-desktop">
                    <h3 data-translate="details.youMightLike">${getText('details.youMightLike')}</h3>
                    <div class="related-content-grid">
                        ${relatedContentGridHtml}
                    </div>
                </div>
            </div>
            <div class="modal-sidebar-content">
                <div class="modal-header-new">
                    <div class="modal-poster-new"><img src="${posterPath}" alt="${title}"></div>
                    <div class="modal-info-new">
                        <h2 class="modal-title-new">${title}</h2>
                        <p class="modal-meta-new"><strong data-translate="details.year">${getText('details.year')}</strong> ${(data.release_date || data.first_air_date || '').split('-')[0] || getText('content.notAvailable')}</p>
                        <p class="modal-meta-new"><strong data-translate="details.genre">${getText('details.genre')}</strong> ${genres}</p>
                        <p class="modal-meta-new"><strong data-translate="${type === 'movie' ? 'details.director' : 'details.creator'}">${getText(type === 'movie' ? 'details.director' : 'details.creator')}:</strong> ${director}</p>
                        <p class="modal-meta-new"><strong data-translate="details.cast">${getText('details.cast')}</strong> ${cast}</p>
                    </div>
                </div>
                ${currentUser ? `<button class="modal-btn modal-btn-primary" id="modal-add-to-list-btn" style="width: 70%; margin: 15px auto; display: block;"><i class="fas fa-plus"></i> <span data-translate="details.addToMyList">${getText('details.addToMyList')}</span></button>` : ''}
                <div id="media-options-container" class="media-options-container"></div>
                <div class="modal-overview-new">
                    ${noteHtml}
                    <p>${overview}</p>
                </div>
            </div>
            <div class="related-content-container related-mobile">
                <h3 data-translate="details.youMightLike">${getText('details.youMightLike')}</h3>
                <div class="related-content-grid">
                    ${relatedContentGridHtmlMobile}
                </div>
            </div>
        </div>`;

    modalContainer.querySelector('.modal-content-wrapper').innerHTML = modalContentHtml;

    modalContainer.querySelectorAll('.related-card').forEach(card => {
        card.addEventListener('click', () => {
            const newId = card.dataset.id;
            const newType = card.dataset.type;
            showMovieDetailsModal(newId, newType);
        });
    });

    if (currentUser) {
        const addToListBtn = modalContainer.querySelector('#modal-add-to-list-btn');
        if (addToListBtn) {
            addToListBtn.addEventListener('click', (e) => {
                const itemForMyList = {
                    id: data.id,
                    media_type: type,
                    title: data.title || data.name,
                    poster_path: data.poster_path,
                    release_date: data.release_date || data.first_air_date,
                    vote_average: data.vote_average
                };
                saveToMyList(itemForMyList, e.currentTarget);
            });
        }
    }
    
    const videoData = firestoreData.video_url || null;
    const seasonData = firestoreData.seasons || null;

    if (type === 'movie') {
        if (videoData) {
            playInIframe(videoData);
        } else {
            document.getElementById('modal-video-container').style.display = 'none';
            document.getElementById('media-options-container').innerHTML = `<p class="empty-text">${getText('details.videoNotAvailable')}</p>`;
        }
    } else if (type === 'tv') {
        renderFirestoreSeriesAccordion(seasonData);

        let firstEpisodeUrl = null;
        if (seasonData && Object.keys(seasonData).length > 0) {
            const sortedSeasons = Object.values(seasonData).sort((a, b) => a.season_number - b.season_number);
            let firstSeasonWithEpisodes = sortedSeasons.find(s => s.season_number > 0 && s.episodes && Object.keys(s.episodes).length > 0) || sortedSeasons.find(s => s.episodes && Object.keys(s.episodes).length > 0);
            if (firstSeasonWithEpisodes) {
                const sortedEpisodes = Object.values(firstSeasonWithEpisodes.episodes).sort((a, b) => a.episode_number - b.episode_number);
                if (sortedEpisodes.length > 0 && sortedEpisodes[0].video_url) {
                    firstEpisodeUrl = sortedEpisodes[0].video_url;
                }
            }
        }

        if (firstEpisodeUrl) {
            playInIframe(firstEpisodeUrl);
        } else {
            document.getElementById('modal-video-container').style.display = 'none';
        }
    }
}

async function handleTmdbSearch() {
  const query = document.getElementById('tmdb-search-input').value.trim();
  if (!query) {
    showMessageModal(getText('search.emptyQueryTitle'), getText('search.emptyQueryText'), 'info');
    return;
  }

  showSpinner();
  try {
    const response = await fetch(`${API_BASE_URL}/search/multi?api_key=${API_KEY}&language=${webSettings.importLanguage}&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(getText('tmdb.searchError'));
    }
    const data = await response.json();
    const validResults = data.results.filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path);
    renderTmdbSearchResults(validResults);
  } catch (error) {
    console.error('Error en la búsqueda de TMDB:', error);
    showMessageModal(getText('tmdb.searchErrorTitle'), getText('tmdb.searchErrorText'), 'error');
  } finally {
    hideSpinner();
  }
}

function renderTmdbSearchResults(results) {
  const resultsContainer = document.getElementById('tmdb-search-results');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = `<p>${getText('search.noResults')}</p>`;
    return;
  }

  results.forEach(async (item) => {
    const card = document.createElement('div');
    card.className = 'grid-card'; 

    const posterPath = `${IMG_BASE_URL}/w500${item.poster_path}`;
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || '').split('-')[0] || getText('content.notAvailable');
    const type = item.media_type === 'movie' ? getText('content.type.movie') : getText('content.type.series');
    
    const contentRef = doc(db, 'content', String(item.id));
    const contentDoc = await getDoc(contentRef);
    const alreadyExists = contentDoc.exists();

    card.innerHTML = `
      <img src="${posterPath}" alt="${title}" class="grid-poster">
      <div class="grid-info">
        <h3 class="grid-title">${title}</h3>
        <div class="grid-meta">
          <span>${year}</span>
          <span>${type}</span>
        </div>
      </div>
      <div class="grid-actions-2">
        ${alreadyExists
          ? `<button class="grid-btn delete-btn" style="background-color: var(--error-color);"><i class="fas fa-trash"></i> ${getText('actions.delete')}</button>`
          : `<button class="grid-btn-import import-btn"><i class="fas fa-download"></i> ${getText('actions.import')}</button>`
        }
      </div>
    `;

    if (alreadyExists) {
        card.querySelector('.delete-btn').addEventListener('click', () => {
            showDeleteContentConfirmationModal(item.id);
        });
    } else {
        card.querySelector('.import-btn').addEventListener('click', () => {
            importTmdbContent(item);
        });
    }

    resultsContainer.appendChild(card);
  });
}

async function importTmdbContent(item) {
  if (!isAdmin) {
    showMessageModal(getText('modal.notAuthorizedTitle'), getText('modal.notAuthorizedText'), 'error');
    return;
  }
  
  const contentRef = doc(db, 'content', String(item.id));
  const contentDoc = await getDoc(contentRef);

  if (contentDoc.exists()) {
    showMessageModal(getText('modal.duplicateContentTitle'), getText('modal.duplicateContentText'), 'info');
    return;
  }

  isEditMode = false;
  itemToImport = item;
  showVideoUrlModal(item);
}

async function showVideoUrlModal(item) {
    const itemToShow = isEditMode ? itemToEdit : itemToImport;
    videoUrlModalBody.innerHTML = ''; 
    videoUrlModal.style.display = 'flex';
    saveVideoUrls.textContent = isEditMode ? getText('actions.updateUrls') : getText('actions.next');

    let fullItemData = itemToShow;
    if (isEditMode) {
        videoUrlModalTitle.textContent = `${getText('modal.editUrlsTitle')} ${itemToShow.title || itemToShow.name}`;
    } else {
        videoUrlModalTitle.textContent = `${getText('modal.addUrlsTitle')} ${itemToShow.title || itemToShow.name}`;
    }

    if (fullItemData.media_type === 'movie') {
        importCsvBtn.style.display = 'none'; // Hide for movies
        const currentUrl = fullItemData.video_url || '';
        videoUrlModalBody.innerHTML = `
            <div class="form-group">
                <label for="movie-video-url">${getText('modal.videoUrlLabel')}</label>
                <input type="text" id="movie-video-url" class="form-input" placeholder="https://..." value="${currentUrl}">
            </div>
        `;
    } else if (fullItemData.media_type === 'tv') {
        importCsvBtn.style.display = 'block'; // Show for TV series
        videoUrlModalBody.innerHTML = `<div class="spinner"></div>`;

        if (isEditMode) {
            // Fetch latest series data from TMDB to find new episodes/seasons
            const tmdbSeriesUrl = `${API_BASE_URL}/tv/${fullItemData.id}?api_key=${API_KEY}&language=${webSettings.importLanguage}`;
            const tmdbResponse = await fetch(tmdbSeriesUrl);
            if (tmdbResponse.ok) {
                const tmdbData = await tmdbResponse.json();

                // Ensure itemToEdit.seasons is an object map for easy lookup
                if (Array.isArray(itemToEdit.seasons)) {
                    // Convert array to object without losing data
                    itemToEdit.seasons = itemToEdit.seasons.reduce((acc, season) => {
                        if (season && season.season_number) {
                            acc[season.season_number] = season;
                        }
                        return acc;
                    }, {});
                } else if (!itemToEdit.seasons) {
                    itemToEdit.seasons = {};
                }
                
                for (const tmdbSeason of tmdbData.seasons) {
                    if (tmdbSeason.season_number === 0) continue; // Skip specials

                    const seasonNum = tmdbSeason.season_number;
                    
                    // Fetch full season details from TMDB to get all episodes
                    const seasonDetailsUrl = `${API_BASE_URL}/tv/${fullItemData.id}/season/${seasonNum}?api_key=${API_KEY}&language=${webSettings.importLanguage}`;
                    const seasonResponse = await fetch(seasonDetailsUrl);
                    if (seasonResponse.ok) {
                        const seasonData = await seasonResponse.json();
                        
                        // If season doesn't exist in Firestore data, add it
                        if (!itemToEdit.seasons[seasonNum]) {
                            itemToEdit.seasons[seasonNum] = {
                                ...tmdbSeason,
                                episodes: {}
                            };
                        }

                        // Ensure episodes object exists
                        if (!itemToEdit.seasons[seasonNum].episodes) {
                            itemToEdit.seasons[seasonNum].episodes = {};
                        }

                        // Add new episodes from TMDB
                        if (seasonData.episodes) {
                            for (const tmdbEpisode of seasonData.episodes) {
                                const episodeNum = tmdbEpisode.episode_number;
                                if (!itemToEdit.seasons[seasonNum].episodes[episodeNum]) {
                                    // Preserve existing video_url if it somehow exists (unlikely but safe)
                                    const existingEpisode = itemToEdit.seasons[seasonNum].episodes[episodeNum];
                                    itemToEdit.seasons[seasonNum].episodes[episodeNum] = {
                                        ...tmdbEpisode,
                                        video_url: existingEpisode?.video_url || ''
                                    };
                                }
                            }
                        }
                    }
                }
            }
            fullItemData = itemToEdit; // Make sure we use the updated data
        } else {
            // This is the existing import logic
            const seriesDetailsUrl = `${API_BASE_URL}/tv/${fullItemData.id}?api_key=${API_KEY}&language=${webSettings.importLanguage}`;
            const response = await fetch(seriesDetailsUrl);
            fullItemData = await response.json();
            fullItemData.media_type = 'tv';
            itemToImport = fullItemData; 
        }
        
        let formHtml = '<div class="seasons-accordion">';
        
        const seasonsArray = (Array.isArray(fullItemData.seasons) 
            ? fullItemData.seasons 
            : Object.values(fullItemData.seasons || {}).sort((a, b) => a.season_number - b.season_number))
            .filter(season => season.season_number !== 0);

        for (const season of seasonsArray) {
            const hasEpisodes = !isEditMode ? season.episode_count > 0 : (season.episodes && Object.keys(season.episodes).length > 0);
            if (!hasEpisodes) continue;
            
            formHtml += `
                <div class="accordion-item">
                    <div class="accordion-header">
                        <span>${getText('details.season')} ${season.season_number}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="accordion-content" style="display: none;">
                        <ul class="episodes-list-form" id="season-${season.season_number}-episodes"><li>${getText('modal.loading')}</li></ul>
                    </div>
                </div>`;
        }
        formHtml += '</div>';
        videoUrlModalBody.innerHTML = formHtml;
        
        for (const season of seasonsArray) {
            const episodesListEl = document.getElementById(`season-${season.season_number}-episodes`);
            if (!episodesListEl) continue;

            let episodes;
            if (isEditMode) {
                // In edit mode, episodes are already on the object from Firestore
                episodes = Object.values(season.episodes || {}).sort((a, b) => a.episode_number - b.episode_number);
            } else {
                // In import mode, fetch episodes for the season from TMDB
                const seasonDetailsUrl = `${API_BASE_URL}/tv/${fullItemData.id}/season/${season.season_number}?api_key=${API_KEY}&language=${webSettings.importLanguage}`;
                const seasonResponse = await fetch(seasonDetailsUrl);
                const seasonData = await seasonResponse.json();
                episodes = seasonData.episodes || [];
                
                const importSeason = itemToImport.seasons.find(s => s.id === season.id);
                if (importSeason) {
                    importSeason.episodes = episodes;
                }
            }

            episodesListEl.innerHTML = '';
            episodes.forEach(episode => {
                const currentUrl = episode.video_url || '';
                episodesListEl.innerHTML += `
                    <li>
                        <label for="video-url-s${season.season_number}-e${episode.episode_number}">${getText('details.episode')} ${episode.episode_number}: ${episode.name}</label>
                        <input type="text" id="video-url-s${season.season_number}-e${episode.episode_number}" class="form-input" data-season="${season.season_number}" data-episode="${episode.episode_number}" value="${currentUrl}" placeholder="https://...">
                    </li>
                `;
            });
        }

        videoUrlModalBody.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                header.querySelector('i').classList.toggle('fa-chevron-down');
                header.querySelector('i').classList.toggle('fa-chevron-up');
            });
        });
    }
}

function handleSaveUrls(event) {
    event.preventDefault();
    if (isEditMode) {
        handleUpdateContentUrls();
    } else {
        proceedToImportOptions();
    }
}

async function handleUpdateContentUrls() {
    if (!itemToEdit) return;
    showSpinner();
    const updateData = {};

    if (itemToEdit.media_type === 'movie') {
        updateData.video_url = document.getElementById('movie-video-url').value.trim();
    } else if (itemToEdit.media_type === 'tv') {
        // Create a deep copy to avoid modifying the original object directly
        const updatedSeasons = JSON.parse(JSON.stringify(itemToEdit.seasons));

        for (const seasonKey in updatedSeasons) {
            const season = updatedSeasons[seasonKey];
            for (const episodeKey in season.episodes) {
                const episode = season.episodes[episodeKey];
                const input = document.getElementById(`video-url-s${season.season_number}-e${episode.episode_number}`);
                if (input) {
                    episode.video_url = input.value.trim();
                }
            }
        }
        updateData.seasons = updatedSeasons;
    }

    try {
        const contentRef = doc(db, 'content', String(itemToEdit.id));
        await updateDoc(contentRef, updateData);

        // Update the item in the global allContent array to reflect changes immediately
        const index = allContent.findIndex(item => item.id === itemToEdit.id);
        if (index > -1) {
            allContent[index] = { ...allContent[index], ...updateData };
        }
        
        videoUrlModal.style.display = 'none';
        showMessageModal(getText('modal.successTitle'), getText('modal.urlsUpdatedSuccess'), 'success');
        loadAllImportedContent(); // Refresh the grid
    } catch (error) {
        console.error("Error updating content URLs:", error);
        showMessageModal(getText('modal.errorTitle'), getText('modal.urlsUpdatedError'), 'error');
    } finally {
        hideSpinner();
        isEditMode = false;
        itemToEdit = null;
    }
}

function proceedToImportOptions() {
    if (!itemToImport) return;

    if (itemToImport.media_type === 'movie') {
        itemToImport.video_url = document.getElementById('movie-video-url').value.trim();
    } else if (itemToImport.media_type === 'tv') {
        itemToImport.seasons.forEach(season => {
            if (season.episodes) {
                season.episodes.forEach(episode => {
                    const input = document.getElementById(`video-url-s${season.season_number}-e${episode.episode_number}`);
                    if (input) {
                        episode.video_url = input.value.trim();
                    }
                });
            }
        });
    }

    videoUrlModal.style.display = 'none';
    importOptionsModal.style.display = 'flex';
    document.getElementById('import-options-form').reset();
    homeOptionsContainer.style.display = 'block';

    const nextEpisodeNoteGroup = document.getElementById('next-episode-note-group');
    if (itemToImport.media_type === 'tv') {
        nextEpisodeNoteGroup.style.display = 'block';
    } else {
        nextEpisodeNoteGroup.style.display = 'none';
    }
}


async function confirmImportWithSections(event) {
    event.preventDefault();
    const item = isEditMode ? itemToEdit : itemToImport;
    if (!item) return;

    showSpinner();
    try {
        const mainSections = Array.from(document.querySelectorAll('input[name="main-section"]:checked')).map(cb => cb.value);
        const homeSections = Array.from(document.querySelectorAll('input[name="home-section"]:checked')).map(cb => cb.value);
        const platformSections = Array.from(document.querySelectorAll('input[name="platform-section"]:checked')).map(cb => cb.value);

        const displayOptions = {
            main_sections: mainSections,
            home_sections: homeSections,
            platforms: platformSections,
        };

        if (isEditMode) {
            // --- EDIT LOGIC ---
            const contentRef = doc(db, 'content', String(item.id));
            const updateData = { display_options: displayOptions };
            if (item.media_type === 'tv') {
                updateData.next_episode_note = document.getElementById('next-episode-note').value.trim();
            }
            await updateDoc(contentRef, updateData);


            // Update the item in the global allContent array
            const index = allContent.findIndex(content => content.id === item.id);
            if (index > -1) {
                allContent[index].display_options = displayOptions;
                if (item.media_type === 'tv') {
                    allContent[index].next_episode_note = updateData.next_episode_note;
                }
                itemToEdit.display_options = displayOptions; // Also update the object in memory
            }
            
            importOptionsModal.style.display = 'none';
            document.getElementById('next-episode-note-group').style.display = 'none';
            
            // Restore original modal title and button text
            document.getElementById('import-options-title').textContent = getText('modal.importOptionsTitle');
            confirmImport.textContent = getText('modal.importButton');

            // Now that sections are saved, proceed to URL editing
            await showVideoUrlModal(itemToEdit);

        } else {
            // --- IMPORT LOGIC (existing code) ---
            if (item.media_type === 'movie' && !mainSections.includes('movies')) {
                mainSections.push('movies');
            }
            if (item.media_type === 'tv' && !mainSections.includes('series')) {
                mainSections.push('series');
            }
            displayOptions.main_sections = mainSections;

            const contentDataForFirestore = {
                id: item.id,
                media_type: item.media_type,
                title: item.title || item.name,
                original_title: item.original_title || item.original_name,
                overview: item.overview,
                poster_path: item.poster_path,
                backdrop_path: item.backdrop_path,
                release_date: item.release_date || item.first_air_date,
                vote_average: item.vote_average,
                genres: item.genres ? item.genres.map(g => g.id) : (item.genre_ids || []),
                imported_at: serverTimestamp(),
                imported_by: currentUser.email,
                display_options: displayOptions,
            };

            if (item.media_type === 'movie') {
                contentDataForFirestore.video_url = item.video_url || '';
            } else if (item.media_type === 'tv') {
                contentDataForFirestore.next_episode_note = document.getElementById('next-episode-note').value.trim();
                const seasons = {};
                if (item.seasons) {
                    item.seasons
                        .filter(season => season.season_number !== 0)
                        .forEach(season => {
                            const episodes = {};
                            if (season.episodes) {
                                season.episodes.forEach(episode => {
                                    episodes[episode.episode_number] = {
                                        episode_number: episode.episode_number, name: episode.name, overview: episode.overview,
                                        air_date: episode.air_date, still_path: episode.still_path, video_url: episode.video_url || ''
                                    };
                                });
                            }
                            seasons[season.season_number] = {
                                season_number: season.season_number, name: season.name, poster_path: season.poster_path,
                                air_date: season.air_date, episodes: episodes
                            };
                        });
                }
                contentDataForFirestore.seasons = seasons;
            }
            
            const contentRef = doc(db, 'content', String(item.id));
            await setDoc(contentRef, contentDataForFirestore);

            const contentDataForClient = { ...contentDataForFirestore, imported_at: { seconds: Math.floor(new Date().getTime() / 1000) } };
            allContent.push(contentDataForClient);

            moviesContent = allContent.filter(i => i.media_type === 'movie');
            seriesContent = allContent.filter(i => i.media_type === 'tv');

            await refreshUI();
            
            showMessageModal(getText('modal.successTitle'), getText('modal.importSuccess', { title: contentDataForFirestore.title }), 'success');
            importOptionsModal.style.display = 'none';
            document.getElementById('next-episode-note-group').style.display = 'none';
            itemToImport = null;
        }

    } catch (error) {
        console.error('Error en confirmImportWithSections:', error);
        showMessageModal(getText('modal.errorTitle'), getText('modal.saveOptionsError'), 'error');
    } finally {
        hideSpinner();
        // Resetting is handled within each logic path now
    }
}

async function refreshUI() {
    // This function is called after `allContent` is modified to ensure the UI reflects the changes.
    console.log("Refreshing UI based on new data...");

    loadDeferredContent();
    const heroContent = await generateHeroContent();
    renderHeroSlides(heroContent);

    const contentGridAgnosticViews = ['movies', 'series', 'animes', 'netflix', 'disney', 'hbo', 'prime', 'paramount'];
    if (contentGridAgnosticViews.includes(currentView)) {
        navigateToView(currentView);
    }
    
    if (adminPanel.classList.contains('active')) {
        const currentAdminTab = document.querySelector('.admin-tab.active')?.dataset.tab;
        if (currentAdminTab === 'manage-content') {
            loadAllImportedContent();
        } else if (currentAdminTab === 'content') { // TMDB search tab
            const tmdbQuery = document.getElementById('tmdb-search-input').value.trim();
            if (tmdbQuery) {
                handleTmdbSearch();
            }
        }
    }
    
    console.log("UI Refresh complete.");
}

function showDeleteContentConfirmationModal(contentId) {
    deleteContentId.value = contentId;
    deleteContentConfirmationModal.style.display = 'flex';
}

async function loadWebSettings() {
  try {
    const settingsRef = doc(db, "web_config", "settings");
    const settingsDoc = await getDoc(settingsRef);
    if (settingsDoc.exists()) {
      const fetchedSettings = settingsDoc.data();
      // Deep merge with defaults to avoid losing nested properties
      webSettings = {
        ...webSettings,
        ...fetchedSettings,
        heroSlider: { ...webSettings.heroSlider, ...fetchedSettings.heroSlider },
        homepageSections: { ...webSettings.homepageSections, ...fetchedSettings.homepageSections },
      };
      console.log("Web settings loaded from Firestore.");
    } else {
      console.log("No web settings found in Firestore, using defaults and saving them.");
      await setDoc(settingsRef, webSettings);
    }
  } catch (error) {
    console.error("Error loading web settings, using defaults:", error);
  }
}

function populateSettingsForm() {
  if (!isAdmin || !settingsForm) return;

  // General Settings
  importLanguageSelect.value = webSettings.importLanguage;
  displayLanguageSelect.value = webSettings.displayLanguage;

  // Hero Slider
  heroSliderPostersInput.value = webSettings.heroSlider.posters;
  heroSliderRandomInput.value = webSettings.heroSlider.random;
  heroSliderRecentInput.value = webSettings.heroSlider.recent;

  // Homepage Sections
  postersEnEstrenoInput.value = webSettings.homepageSections.enEstreno;
  postersRecienAgregadoInput.value = webSettings.homepageSections.recienAgregado;
  postersPeliculasPopularesInput.value = webSettings.homepageSections.peliculasPopulares;
  postersSeriesPopularesInput.value = webSettings.homepageSections.seriesPopulares;

  // Visible Categories
  if (webSettings.visibleCategories.length === 0) {
    webSettings.visibleCategories = ALL_CATEGORIES.map(c => String(c.genreId));
  }
  visibleCategoriesContainer.innerHTML = ALL_CATEGORIES.map(cat => `
    <label>
      <input type="checkbox" name="visible-category" value="${cat.genreId}" ${webSettings.visibleCategories.includes(String(cat.genreId)) ? 'checked' : ''}>
      ${getText(cat.key)}
    </label>
  `).join('');

  // Visible Platforms
  const platforms = [
    { name: 'Netflix', id: 'netflix' }, { name: 'Disney+', id: 'disney' },
    { name: 'HBO Max', id: 'hbo' }, { name: 'Prime Video', id: 'prime' },
    { name: 'Paramount+', id: 'paramount' }
  ];
  if (webSettings.visiblePlatforms.length === 0) {
      webSettings.visiblePlatforms = platforms.map(p => p.id);
  }
  visiblePlatformsContainer.innerHTML = platforms.map(plat => `
    <label>
      <input type="checkbox" name="visible-platform" value="${plat.id}" ${webSettings.visiblePlatforms.includes(plat.id) ? 'checked' : ''}>
      ${plat.name}
    </label>
  `).join('');
}

async function saveWebSettings(e) {
  e.preventDefault();
  if (!isAdmin) return;

  showSpinner();
  try {
    const newSettings = {
      importLanguage: importLanguageSelect.value,
      displayLanguage: displayLanguageSelect.value,
      heroSlider: {
        posters: parseInt(heroSliderPostersInput.value),
        random: parseInt(heroSliderRandomInput.value),
        recent: parseInt(heroSliderRecentInput.value),
      },
      visibleCategories: Array.from(document.querySelectorAll('input[name="visible-category"]:checked')).map(cb => cb.value),
      visiblePlatforms: Array.from(document.querySelectorAll('input[name="visible-platform"]:checked')).map(cb => cb.value),
      homepageSections: {
        enEstreno: parseInt(postersEnEstrenoInput.value),
        recienAgregado: parseInt(postersRecienAgregadoInput.value),
        peliculasPopulares: parseInt(postersPeliculasPopularesInput.value),
        seriesPopulares: parseInt(postersSeriesPopularesInput.value),
      }
    };

    const settingsRef = doc(db, "web_config", "settings");
    await setDoc(settingsRef, newSettings);
    
    webSettings = newSettings; // Update global object
    
    // Apply changes dynamically without reloading
    await loadAllContent();
    applyStaticTranslations();
    updateUIForLoggedInUser(); // To update dropdown text language if changed

    showMessageModal(getText('settings.saveSuccess'), getText('settings.saveSuccess'), 'success');

  } catch (error) {
    console.error("Error saving web settings:", error);
    showMessageModal(getText('settings.saveError'), getText('settings.saveError'), 'error');
  } finally {
    hideSpinner();
  }
}

async function handleDeleteContent() {
    const contentId = deleteContentId.value;
    if (!contentId) return;

    showSpinner();
    try {
        // 1. Delete from Firestore
        await deleteDoc(doc(db, "content", String(contentId)));

        const index = allContent.findIndex(item => String(item.id) === contentId);
        if (index > -1) {
            allContent.splice(index, 1);
        }

        moviesContent = allContent.filter(item => item.media_type === 'movie');
        seriesContent = allContent.filter(item => item.media_type === 'tv');

        await refreshUI();
        
        showMessageModal(getText('modal.deleteContentSuccessTitle'), getText('modal.deleteContentSuccessText'), 'success');

    } catch (error) {
        console.error("Error deleting content:", error);
        showMessageModal(getText('modal.deleteContentErrorTitle'), getText('modal.deleteContentErrorText'), 'error');
    } finally {
        hideSpinner();
        deleteContentConfirmationModal.style.display = 'none';
    }
}

async function seedDatabase() {
    if (!isAdmin) {
        showMessageModal(getText('modal.notAuthorizedTitle'), getText('modal.notAuthorizedText'), 'error');
        return;
    }

    const confirmation = confirm(getText('modal.seedDbConfirm'));
    if (!confirmation) {
        return;
    }

    showSpinner();
    try {
        const allIds = [...seedContentIds.movies, ...seedContentIds.series];
        let importedCount = 0;
        let skippedCount = 0;

        for (const id of allIds) {
            const media_type = seedContentIds.movies.includes(id) ? 'movie' : 'tv';
            const contentRef = doc(db, 'content', String(id));
            const contentDoc = await getDoc(contentRef);

            if (contentDoc.exists()) {
                skippedCount++;
                continue;
            }

            const item = await fetchContentByIds([id], media_type);
            if (item && item.length > 0) {
                await importTmdbContent(item[0]);
                importedCount++;
            }
        }

        showMessageModal(getText('modal.seedDbSuccessTitle'), getText('modal.seedDbSuccessText', { importedCount, skippedCount }), 'success');
    } catch (error) {
        console.error('Error poblando la base de datos:', error);
        showMessageModal(getText('modal.errorTitle'), getText('modal.seedDbError'), 'error');
    } finally {
        hideSpinner();
    }
}

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

function initLazyLoading() {
  // Comprueba si el navegador soporta Intersection Observer
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          
          // Reemplaza el src con el data-src
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute('data-src');
          }
          
          // Añade la clase loaded para efectos de transición
          lazyImage.classList.add('loaded');
          
          // Deja de observar la imagen una vez cargada
          observer.unobserve(lazyImage);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      lazyImageObserver.observe(img);
    });
  } else {

    document.querySelectorAll('img.lazy').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      }
    });
  }
}

function renderCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.innerHTML = '';

    const visibleCategories = ALL_CATEGORIES.filter(cat => webSettings.visibleCategories.includes(String(cat.genreId)));

    visibleCategories.forEach(category => {
        const categoryName = getText(category.key);
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.dataset.genre = category.genreId;
        categoryItem.dataset.name = categoryName;

        categoryItem.innerHTML = `
            <div class="category-icon-wrapper">
                <i class="${category.icon} category-icon"></i>
            </div>
            <span class="category-name">${categoryName}</span>
        `;
        categoriesContainer.appendChild(categoryItem);

        categoryItem.addEventListener('click', handleCategoryClick);
    });
}

function renderPlatforms() {
    const servicesContainer = document.getElementById('streaming-services');
    const allPlatformItems = servicesContainer.querySelectorAll('.service-item');
    allPlatformItems.forEach(item => {
        if (!webSettings.visiblePlatforms.includes(item.dataset.service)) {
            item.style.display = 'none';
        } else {
            item.style.display = '';
        }
    });
}

function loadAllImportedContent() {
    if (!isAdmin) return;
    showSpinner();
    try {
        const searchInput = document.getElementById('manage-content-search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        filterManageableContent();
    } catch (error) {
        console.error("Error loading all imported content:", error);
        document.getElementById('manage-content-grid').innerHTML = `<p>${getText('content.loadError')}</p>`;
    } finally {
        hideSpinner();
    }
}

function filterManageableContent() {
    const query = document.getElementById('manage-content-search-input').value.toLowerCase().trim();

    currentManageContentData = [...allContent].sort((a, b) => (b.imported_at?.seconds || 0) - (a.imported_at?.seconds || 0));

    if (query) {
        currentManageContentData = currentManageContentData.filter(item => {
            const title = item.title || item.name || '';
            return title.toLowerCase().includes(query);
        });
    }

    manageContentCurrentPage = 1;
    document.getElementById('manage-content-grid').innerHTML = '';
    renderNextManageContentBatch();
}

function renderNextManageContentBatch() {
    if (isManageContentLoadingMore) return;
    isManageContentLoadingMore = true;

    const grid = document.getElementById('manage-content-grid');
    const loadMoreButton = document.getElementById('load-more-manage-content');

    const startIndex = (manageContentCurrentPage - 1) * manageContentPerPage;
    const endIndex = startIndex + manageContentPerPage;
    const batch = currentManageContentData.slice(startIndex, endIndex);

    renderManageableContentGrid(batch, true); // Append content
    manageContentCurrentPage++;

    if (loadMoreButton) {
        if (endIndex >= currentManageContentData.length) {
            loadMoreButton.parentElement.style.display = 'none';
        } else {
            loadMoreButton.parentElement.style.display = 'block';
        }
    }
    
    if (currentManageContentData.length === 0 && startIndex === 0) {
        grid.innerHTML = `<p>${getText('content.noContent')}</p>`;
    }

    isManageContentLoadingMore = false;
}


function renderManageableContentGrid(content, append = false) {
    const grid = document.getElementById('manage-content-grid');
    if (!append) {
        grid.innerHTML = '';
    }

    if (content.length === 0 && !append) {
        grid.innerHTML = `<p>${getText('content.noImportedContent')}</p>`;
        return;
    }
    content.forEach(item => {
        const card = document.createElement('div');
        card.className = 'grid-card';
        const posterPath = item.poster_path ? `${IMG_BASE_URL}/w500${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
        const title = item.title || item.name;
        const year = (item.release_date || item.first_air_date || '').split('-')[0] || getText('content.notAvailable');
        const type = item.media_type === 'movie' ? getText('content.type.movie') : getText('content.type.series');

        card.innerHTML = `
          <img src="${posterPath}" alt="${title}" class="grid-poster">
          <div class="grid-info">
            <h3 class="grid-title">${title}</h3>
            <div class="grid-meta">
              <span>${year}</span>
              <span>${type}</span>
            </div>
          </div>
          <div class="grid-actions-2">
            <button class="edit-btn"><i class="fas fa-edit"></i> ${getText('actions.edit')}</button>
            <button class="delete-btn" style="background-color: var(--error-color);"><i class="fas fa-trash"></i> ${getText('actions.delete')}</button>
          </div>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => {
            showEditContentModal(item);
        });

        card.querySelector('.delete-btn').addEventListener('click', () => {
            showDeleteContentConfirmationModal(item.id);
        });
        grid.appendChild(card);
    });
}

function showEditContentModal(item) {
    isEditMode = true;
    itemToEdit = item; // Store the item being edited

    // Pre-populate the import options modal
    const form = document.getElementById('import-options-form');
    form.reset(); // Reset previous selections

    // Show/hide and populate the next episode note field
    const nextEpisodeNoteGroup = document.getElementById('next-episode-note-group');
    const nextEpisodeNote = document.getElementById('next-episode-note');
    if (item.media_type === 'tv') {
        nextEpisodeNoteGroup.style.display = 'block';
        nextEpisodeNote.value = item.next_episode_note || '';
    } else {
        nextEpisodeNoteGroup.style.display = 'none';
        nextEpisodeNote.value = '';
    }

    const displayOptions = item.display_options || {};
    const mainSections = displayOptions.main_sections || [];
    const homeSections = displayOptions.home_sections || [];
    const platformSections = displayOptions.platforms || [];

    mainSections.forEach(section => {
        const checkbox = form.querySelector(`input[name="main-section"][value="${section}"]`);
        if (checkbox) checkbox.checked = true;
    });

    homeSections.forEach(section => {
        const checkbox = form.querySelector(`input[name="home-section"][value="${section}"]`);
        if (checkbox) checkbox.checked = true;
    });

    platformSections.forEach(section => {
        const checkbox = form.querySelector(`input[name="platform-section"][value="${section}"]`);
        if (checkbox) checkbox.checked = true;
    });

    document.getElementById('import-options-title').textContent = getText('modal.editDisplayOptions');
    confirmImport.textContent = getText('modal.saveAndContinueButton');

    importOptionsModal.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  initLazyLoading();
});

// Código de donación encapsulado para evitar conflictos
(function() {
  // Función para inicializar el modal de donaciones
  function initDonationModal() {
    // Referencias a elementos del DOM
    var floatingDonationBtn = document.getElementById('floating-donation-btn');
    var donationModal = document.getElementById('donation-modal');
    var closeDonationModal = document.getElementById('close-donation-modal');
    var cancelDonation = document.getElementById('cancel-donation');
    var paypalDonateBtn = document.getElementById('paypal-donate-btn');
    var modalOverlay = donationModal.querySelector('.modal-overlay');
    
    // Verificar que todos los elementos existan
    if (!floatingDonationBtn || !donationModal || !closeDonationModal || !cancelDonation || !paypalDonateBtn) {
      console.error(getText('donation.elementsNotFound'));
      return;
    }
    
    // Función para abrir el modal
    function openModal() {
      donationModal.style.display = 'block';
    }
    
    // Función para cerrar el modal
    function closeModal() {
      donationModal.style.display = 'none';
    }
    
    // Función para abrir PayPal
    function openPayPal() {
      window.open('https://www.paypal.com/donate/?hosted_button_id=8TVX4VWNBWVM4', '_blank'); 
    }
    
    // Agregar event listeners
    floatingDonationBtn.onclick = openModal; // CAMBIO AQUÍ 
    closeDonationModal.onclick = closeModal;
    cancelDonation.onclick = closeModal;
    paypalDonateBtn.onclick = openPayPal;
    
    // Cerrar al hacer clic en el overlay
    modalOverlay.onclick = function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    };
  }
  
  // Verificar si el DOM ya está cargado
  if (document.readyState === 'loading') {
    // Si no está cargado, usar el evento load
    window.addEventListener('load', initDonationModal);
  } else {
    // Si ya está cargado, ejecutar directamente
    initDonationModal();
  }
})();

function handleCsvImport(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const rows = text.split('\n').filter(row => row.trim() !== '');
    let importedCount = 0;
    let errorCount = 0;

    rows.forEach(row => {
      const columns = row.split(',').map(col => col.trim());
      if (columns.length === 3) {
        const [season, episode, url] = columns;
        const seasonNum = parseInt(season, 10);
        const episodeNum = parseInt(episode, 10);
        
        if (!isNaN(seasonNum) && !isNaN(episodeNum) && url) {
          const input = document.getElementById(`video-url-s${seasonNum}-e${episodeNum}`);
          if (input) {
            input.value = url;
            importedCount++;
          } else {
            errorCount++;
          }
        } else {
          errorCount++;
        }
      } else {
        errorCount++;
      }
    });

    showMessageModal(
      getText('csv.importCompleteTitle'),
      `${importedCount} ${getText('csv.urlsImportedSuccess')} ${errorCount > 0 ? `${errorCount} ${getText('csv.rowsNotProcessed')}` : ''}`,
      errorCount > 0 ? 'info' : 'success'
    );
  };

  reader.onerror = function() {
    showMessageModal(getText('csv.readErrorTitle'), getText('csv.readErrorText'), 'error');
  };

  reader.readAsText(file);
  // Reset file input to allow selecting the same file again
  csvFileInput.value = '';
}

// Helper for automated testing
window.setLanguageForTesting = async function(lang) {
  webSettings.displayLanguage = lang;
  applyStaticTranslations();
  updateUIForLoggedInUser();
  const heroContent = await generateHeroContent();
  renderHeroSlides(heroContent);
}
