import { useEffect, useState } from "react";
import UserForm from "./FormUser2";
import UserListSection from "./UserListSection";

export default function Usuarios() {

    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [re,setRe] = useState("")
    useEffect(()=>{

    },[])

    return (
        <>
            <UserListSection
                setSelectedUser={setSelectedUser}
                setModalOpen={setModalOpen}
                re={re}
            />

            {modalOpen && (
                <UserForm
                    user={selectedUser}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        setModalOpen(false);
                        setSelectedUser(null);
                    }}
                    setRe={setRe}
                />
            )}

        </>
    );

}