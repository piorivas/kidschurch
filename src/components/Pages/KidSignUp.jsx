import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import privacyPolicy from "../../data/privacyPolicy";
import useDatabase from "../../hooks/useDatabase";
import DynamicModal from "../Modal/DynamicModal";
import moment from "moment";
import util from "../../utils/Utilities";

export const KidSignUp = () => {
  const { id } = useParams();
  const kidId = id;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', closable: true });
  const { request } = useDatabase();
  const token = window.localStorage.getItem('nxtgen.token');

  useEffect(() => {
    if (kidId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await request('kids', 'CHECKEXIST', { id: kidId }, token);
          if (response) {
            setModalContent({
              title: 'Child already exists',
              message: 'Please try a different card or ask any NxtGen volunteer to update the child\'s information.',
              closable: false
            });
            setShowSuccessModal(true);
            setLoading(false);
            return;
          }
          setLoading(false);
        } catch (error) {
          setModalContent({
            title: 'Check ID: Error!',
            message: error,
            closable: true
          });
          setShowSuccessModal(true);
          console.error(error);
          setLoading(false);
        }
      }
      fetchData();
    }
  }, []);

  const submitForm = async ({ id, name, nickname, parent, parent_contact, birthday }, resetForm) => {
    try {
      setLoading(true);
      const now = new Date();
      const response = await request('kids', 'KIDSIGNUP', {
        id: id,
        name: name,
        nickname: nickname,
        parent: parent,
        parent_contact: parent_contact,
        birthday: birthday,
        status: 'Active',
        timestamp: moment().format('MM/DD/YYYY HH:mm:ss')
      }, token);
      setLoading(false);
      setModalContent({
        title: 'Success',
        message: "Your child's account has been created successfully.",
        closable: true
      });
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-fit lg:py-0">
          <div className="w-full bg-white my-8 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                      Register your child
                  </h1>
                  <form className="space-y-4 md:space-y-6" onSubmit={
                    (e) => {
                      e.preventDefault();
                      const form = e.target;
                      submitForm({
                        id: form.id.value,
                        name: form.name.value,
                        nickname: form.nickname.value,
                        parent: form.parent.value,
                        parent_contact: form.parent_contact.value,
                        birthday: (new Date(form.birthday.value)).toLocaleDateString('en-US')
                      }, () => form.reset());
                    }
                  }>
                      {id && (
                        <div>
                          <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-900">ID</label>
                          <input type="text" name="id" id="id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" defaultValue={id} disabled />
                        </div>
                      )}
                      <div>
                          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Full name</label>
                          <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Full name" required />
                      </div>
                      <div>
                          <label htmlFor="nickname" className="block mb-2 text-sm font-medium text-gray-900">Nickname</label>
                          <input type="text" name="nickname" id="nickname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Nickname" required />
                      </div>
                      <div>
                          <label htmlFor="parent" className="block mb-2 text-sm font-medium text-gray-900">Parent/Guardian</label>
                          <input type="text" name="parent" id="parent" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Parent/Guardian" required />
                      </div>
                      <div>
                          <label htmlFor="parent_contact" className="block mb-2 text-sm font-medium text-gray-900">Parent's Contact</label>
                          <input type="text" name="parent_contact" id="parent_contact" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Parent's Contact" required />
                      </div>
                      <div>
                          <label htmlFor="birthday" className="block mb-2 text-sm font-medium text-gray-900">Birthday</label>
                          <input type="date" name="birthday" id="birthday" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                      </div>
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-cyan-300" required />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500">I accept the <a className="font-medium text-cyan-600 hover:underline" href="#" onClick={() => setShowModal(true)}>Privacy Policy</a></label>
                          </div>
                      </div>
                      <button type="submit" className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Register</button>
                  </form>
              </div>
          </div>
      </div>
      {showModal && (
        <DynamicModal
          title="Privacy Policy"
          message={privacyPolicy}
          closable={true}
          onClose={() => setShowModal(false)}
        />
      )}
      {showSuccessModal && (
        <DynamicModal
          title={modalContent.title}
          message={modalContent.message}
          closable={modalContent.closable}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {loading && (
        <DynamicModal
          title="Loading"
          message="Please wait..."
          closable={false}
        />
      )}
    </section>
  )
}