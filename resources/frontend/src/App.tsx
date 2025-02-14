import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { lazy, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import apiClient from "../ApiClient.ts";
import { setAddToCartItemsCount } from "../redux/add-to-cart-items-count.ts";
import { setActive } from "../redux/is-location-is-not-in-navlink-slice.ts";
import { RootState } from "../redux/store.ts";
import { setTranslation } from "../redux/translation-slice.ts";
import { clearUser, setUser } from "../redux/user-slice.ts";
import './App.css';
import AddToCartSidebar from "./components/AddToCartSidebar.tsx";
import ChatSupport from "./components/ChatSupport.tsx";
import SearchModal from "./components/SearchModal.tsx";

// Lazy load components
const Home = lazy(() => import("./pages/Home.tsx"));
const Header = lazy(() => import("./components/Header.tsx"));
const SignUp = lazy(() => import("./pages/auth/SignUp.tsx"));
const SignIn = lazy(() => import("./pages/auth/SignIn.tsx"));
const AddBook = lazy(() => import("./pages/AddBook.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Categories = lazy(() => import("./pages/Categories.tsx"));
const Category = lazy(() => import("./pages/Category.tsx"));
const ShowBook = lazy(() => import("./pages/ShowBook.tsx"));
const Reviews = lazy(() => import("./pages/Reviews.tsx"));
const SearchBookResults = lazy(() => import("./pages/SearchBookResults.tsx"));
const CheckOut = lazy(() => import("./pages/CheckOut.tsx"));
const SetPassword = lazy(() => import("./pages/SetPassword.tsx"));
const AuthRoute = lazy(() => import("./auth/AuthRoute.tsx"));
const AuthRedirect = lazy(() => import("./auth/AuthRedirect.tsx"));

function App() {
    const isSearchModalOpenSlice = useSelector((state: RootState) => state.isSearchModalOpenReducer.is_open);
    const isUnauthorizedMessageOpenSlice = useSelector((state: RootState) => state.isUnauthorizedMessageOpenReducer.is_open);
    const isAddToCartSidebarSlice = useSelector((state: RootState) => state.isAddToCartSidebarReducer.is_open);
    const auth_user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const [showHeader, setShowHeader] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/sign-up' || location.pathname === '/sign-in' || location.pathname === '/set-password')
            setShowHeader(false);
        else
            setShowHeader(true);

        const nav_links = ['/', '/home', '/categories', '/reviews'];
        if (!nav_links.includes(location.pathname)) {
            dispatch(setActive(true));
        } else {
            dispatch(setActive(false));
        }
    }, [location.pathname]);

    const getTranslation = (namespace: string) => {
        const decodedNamespace = decodeURIComponent(namespace);
        const namespaceMapping: { [key: string]: string } = {
            home: 'home',
            books: 'books',
            categories: 'categories',
            users: 'users',
            'sign-up': 'sign-up',
            'sign-in': 'sign-in',
            reviews: 'reviews',
            'add-book': 'add-book',
            checkout: 'checkout',
        };

        if (namespaceMapping[decodedNamespace]) {
            if (namespaceMapping[decodedNamespace] === 'sign-up' || namespaceMapping[decodedNamespace] === 'sign-in') {
                return 'Auth';
            } else if (namespaceMapping[decodedNamespace] === 'add-book') {
                return 'AddBook';
            } else {
                return namespaceMapping[decodedNamespace];
            }
        }

        if (decodedNamespace.startsWith('category_')) {
            return decodedNamespace;
        }
        if (decodedNamespace.startsWith('book_')) {
            return decodedNamespace;
        }

        return null;
    };

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        let namespace = pathSegments[0] || 'home';

        const dynamicRoutePatterns: { [key: string]: string } = {
            categories: 'category_',
            books: 'book_',
        };

        if (pathSegments.length === 2 && dynamicRoutePatterns[pathSegments[0]]) {
            namespace = dynamicRoutePatterns[pathSegments[0]] + decodeURIComponent(pathSegments[1]);
        }

        const validNamespace = getTranslation(namespace);
        if (validNamespace) {
            apiClient()
                .get(`/translation/${validNamespace}`)
                .then((res) => {
                    dispatch(setTranslation(res.data.data));
                })
                .catch((err) => {
                    enqueueSnackbar(err.response.data.errors || 'An error occurred');
                });
        }
    }, [location.pathname]);

    useEffect(() => {
        const previous_books = JSON.parse(localStorage.getItem('book') || '[]');
        dispatch(setAddToCartItemsCount(previous_books.length));
    }, []);

    const [count, setCount] = useState(0);
    const refreshToken = () => {
        setCount(prevCount => {
            const newCount = prevCount === 5 ? 0 : prevCount + 1;
            console.log('Updating count to ', newCount);
            return newCount;
        });

        apiClient().post('/refresh-token')
            .then(res => {
                localStorage.removeItem('token');
                localStorage.removeItem('expires_at');
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('expires_at', res.data.data.expires_at);
                dispatch(setUser(res.data.data.user));
            });
    };

    useEffect(() => {
        const expires_date = localStorage.getItem('expires_at');
        const expiration_date = expires_date ? new Date(expires_date).getTime() : 0;
        const current_date = new Date().getTime();
        const callAfter = (expiration_date - current_date) - 10000;

        if (callAfter <= 0) {
            dispatch(clearUser());
            localStorage.removeItem('token');
            localStorage.removeItem('expires_at');
        } else {
            const timeOut = setTimeout(() => {
                refreshToken();
            }, callAfter);

            return () => {
                clearTimeout(timeOut);
            };
        }
    }, [count, auth_user]);

    return (
        <>
            {(isSearchModalOpenSlice || isUnauthorizedMessageOpenSlice) && <div className={`left-0 top-0 w-screen h-screen fixed z-20 bg-black/70`}></div>}
            {isSearchModalOpenSlice && <SearchModal />}
            <SnackbarProvider
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            />
            <div className={`relative dark:bg-dark_main_color ${isAddToCartSidebarSlice ? 'max-h-svh overflow-hidden' : ''}`}>
                <AddToCartSidebar />
                <ChatSupport/>
                <Suspense fallback={<div>Loading...</div>}>
                    {showHeader && <Header />}
                    <Routes>
                        <Route path={`/`} element={<Home />} />
                        <Route path={'/categories'} element={<Categories />} />
                        <Route path="/users/:user" element={<Profile />} />
                        <Route path={'/categories/:category_slug'} element={<Category />} />
                        <Route path={'/reviews'} element={<Reviews />} />
                        <Route path="/books/:slug" element={<ShowBook />} />
                        <Route path="/search-books-results" element={<SearchBookResults />} />

                        <Route element={<AuthRoute />}>
                            <Route path="/add-book" element={<AddBook />} />
                            <Route path="/checkout" element={<CheckOut />} />
                        </Route>

                        <Route element={<AuthRoute requireSocial />}>
                            <Route path="/set-password" element={<SetPassword />} />
                        </Route>

                        <Route element={<AuthRedirect />}>
                            <Route path={`/sign-up`} element={<SignUp />} />
                            <Route path={`/sign-in`} element={<SignIn />} />
                        </Route>
                    </Routes>
                </Suspense>
            </div>
        </>
    );
}

export default App;