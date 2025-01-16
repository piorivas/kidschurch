import React, { useState } from "react";
import privacyPolicy from "../../data/privacyPolicy";
import useDatabase from "../../hooks/useDatabase";
import DynamicModal from "../Modal/DynamicModal";
import LoadingModal from "../Modal/LoadingModal";
import JsonEditor from "../JsonEditor";

export const VolunteerSignUp = () => {
  const defaultAccess = {
    "kids": ["view", "create", "update", "delete"],
    "users": ["view"],
    "logs_kids": ["view", "create", "update", "delete"],
    "logs_users": ["view"]
  };
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', closable: true });
  const [access, setAccess] = useState(defaultAccess);
  const { request } = useDatabase();

  const submitForm = async ({ name, contact, birthday, email, dleader, dleader_contact, role, level}, resetForm) => {
    try {
      setLoading(true);
      const response = await request('users', 'CREATEUNIQUE', {
        name: name,
        contact: contact,
        birthday: birthday,
        email: email,
        username: email,
        password: '1234',
        joined: new Date().toISOString(),
        dleader: dleader,
        dleader_contact: dleader_contact,
        role: role,
        level: level,
        access: JSON.stringify(access),
        status: 'Active',
        index: 'email'
      });
      setLoading(false);
      setModalContent({
        title: 'Success',
        message: "volunteer data has been successfully created.",
        closable: true
      });
      setShowModal(true);
      resetForm();
    } catch (error) {
      setLoading(false);
      setModalContent({
        title: 'Error',
        message: error.message || 'An error occurred while creating the account.',
        closable: true
      });
      setShowModal(true);
      console.error(error);
    }
  }

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-fit">
          <div className="w-full bg-white mt-0 rounded-lg shadow md:w-[700px] xl:p-0">
              <div className="p-6 sm:p-8">
                  <h1 className="pb-3 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                      New Volunteer
                  </h1>
                  <form className="space-y-4" onSubmit={
                    (e) => {
                      e.preventDefault();
                      const form = e.target;
                      submitForm({
                        name: form.name.value,
                        contact: form.contact.value,
                        birthday: form.birthday.value,
                        email: form.email.value,
                        dleader: form.dleader.value,
                        dleader_contact: form.dleader_contact.value,
                        role: form.role.value,
                        level: form.level.value
                      }, () => {
                        form.reset()
                        setAccess(defaultAccess);
                      });
                    }
                  }>
                    <div className="gap-4 flex flex-col md:flex-row md:flex-wrap md:justify-between">
                      <div className="space-y-4 md:space-y-6 md:w-72">
                          <div>
                              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Full name</label>
                              <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Full name" required />
                          </div>
                          <div>
                              <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900">Contact</label>
                              <input type="text" name="contact" id="contact" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Contact" required />
                          </div>
                          <div>
                              <label htmlFor="birthday" className="block mb-2 text-sm font-medium text-gray-900">Birthday</label>
                              <input type="date" name="birthday" id="birthday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                          </div>
                          <div>
                              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                              <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Email" required />
                          </div>
                      </div>
                      <div className="flex flex-col space-y-4 md:space-y-6 md:grow md:h-[352px]">
                        <div className="flex flex-row w-full gap-2">
                          <div className="w-1/2">
                              <label htmlFor="level" className="block mb-2 text-sm font-medium text-gray-900">Level</label>
                              <select name="level" id="level" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required>
                                <option value="Age 0-3">Age 0-3</option>
                                <option value="Age 4-6">Age 4-6</option>
                                <option value="Age 7-9">Age 7-9</option>
                                <option value="Age 10-12">Age 10-12</option>
                              </select>
                          </div>
                          <div className="w-1/2">
                              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">Role</label>
                              <select name="role" id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required>
                                <option value="Teacher">Teacher</option>
                                <option value="Marshall">Marshall</option>
                                <option value="Leader">Leader</option>
                              </select>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg w-full">
                          <h2 className="flex-grow md:flex-grow-0 text-center bb-2">
                              Dgroup Leader
                          </h2>
                            <div>
                                <label htmlFor="dleader" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                                <input type="text" name="dleader" id="dleader" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Name" required />
                            </div>
                            <div>
                                <label htmlFor="dleader_contact" className="block mb-2 text-sm font-medium text-gray-900">Contact</label>
                                <input type="text" name="dleader_contact" id="dleader_contact" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Contact" required />
                            </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <JsonEditor initialData={access} editable={true} onChange={setAccess} />
                      </div>
                    </div>
                    <button type="submit" className="w-full md:w-fit text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create</button>
                  </form>
              </div>
          </div>
      </div>
      {showModal && (
        <DynamicModal
          title={modalContent.title}
          message={modalContent.message}
          closable={modalContent.closable}
          onClose={() => setShowModal(false)}
        />
      )}
      {loading && (
        <LoadingModal />
      )}
    </section>
  )
}