import { useState } from "react";
import moment from "moment";
import useDatabase from "./../hooks/useDatabase";
import DynamicModal from "./Modal/DynamicModal";

export default function RegisterForm({ onLog, setMessage }) {
    const { request } = useDatabase();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Initialize as false

    const submitForm = async ({ name, nickname, parent, parent_contact, birthday }, resetForm) => {
        try {
            setLoading(true);
            //check if child already exists
            const resultExisting = JSON.parse(await request('kids', 'SEARCH', { name: name, birthday: birthday }));
            if (resultExisting.length > 0) {
                setMessage("Child already exists", "error");
                setLoading(false);
                return;
            }

            const now = new Date();
            const result = JSON.parse(await request('kids', 'KIDSIGNUP', {
                name: name,
                nickname: nickname,
                parent: parent,
                parent_contact: parent_contact,
                birthday: birthday,
                status: 'Active',
                timestamp: moment().format('MM/DD/YYYY HH:mm:ss')
            }));
            setLoading(false);
            setMessage("Your child's account has been created successfully.", "success");
            onLog(`Filler Text||kids||Check-in||${result.id}`);
            resetForm();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <div className="w-full rounded overflow-visible shadow-lg w-full p-4">
            <form className="space-y-4 md:space-y-6" onSubmit={
                (e) => {
                    e.preventDefault();
                    const form = e.target;
                    const name = form.name.value;
                    // Extract the first word from the name as the nickname
                    const nickname = name.split(' ')[0];
                    submitForm({
                        name: name,
                        nickname: nickname,
                        parent: form.parent.value,
                        parent_contact: form.parent_contact.value,
                        birthday: (new Date(form.birthday.value)).toLocaleDateString('en-US')
                    }, () => form.reset());
                }
            }>
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Child's name</label>
                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Full name" required />
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
            {loading && (
                <DynamicModal
                    title="Loading"
                    message="Please wait..."
                    closable={false}
                />
            )}
            {showModal && (
                <DynamicModal
                    title="Privacy Policy"
                    message=""
                    closable={true}
                    onClose={() => setShowModal(false)}
                >
                    <p>
                        Kids Church Ministry Automated Check-In System Privacy Policy
                        <br />
                        Effective Date: January 01, 2025
                        <br />
                        1. Introduction
                        <br />
                        Welcome to the Kids Church Ministry Automated Check-In System. We value your trust and are committed to protecting the privacy of your family’s information. This Privacy Policy outlines how we collect, use, disclose, and safeguard the personal information provided during registration and check-in.
                        <br />
                        2. Information We Collect
                        <br />
                        We collect the following information during registration:
                        <br />
                        - Parent/Guardian Full Name
                        <br />
                        - Contact Information
                        <br />
                        - Child’s Full Name, Date of Birth, and Gender
                        <br />
                        - Allergies, Medical Conditions, and Special Needs (if applicable)
                        <br />
                        - Emergency Contact Information
                        <br />
                        3. Purpose of Data Collection
                        <br />
                        The information collected is used exclusively for the following purposes:
                        <br />
                        - Ensuring child safety and proper identification during check-in and check-out
                        <br />
                        - Providing emergency contact and medical assistance, if necessary
                        <br />
                        - Communicating updates, announcements, or emergencies related to the Kids Church Ministry
                        <br />
                        4. Data Sharing and Disclosure
                        <br />
                        We do not sell, trade, or share personal information with third parties, except:
                        <br />
                        - With authorized church staff and volunteers for operational purposes
                        <br />
                        - In compliance with legal requirements or law enforcement requests
                        <br />
                        - In cases of emergency to protect the safety of children and families
                        <br />
                        5. Data Security
                        <br />
                        We implement appropriate technical and organizational measures to safeguard your data, including encryption, password protection, and access restrictions. However, no system is completely secure, and we encourage parents to notify us immediately of any suspected data breach.
                        <br />
                        6. Data Retention
                        <br />
                        We retain personal information only for as long as necessary to fulfill the purposes outlined in this policy. Data may be deleted upon request, except where retention is required by law or for safety purposes.
                        <br />
                        7. Parental Rights
                        <br />
                        Parents and guardians have the right to:
                        <br />
                        - Access and review their data
                        <br />
                        - Request corrections to inaccurate information
                        <br />
                        - Request deletion of their data (subject to legal obligations)
                        <br />
                        8. Updates to This Policy
                        <br />
                        We may update this Privacy Policy periodically. Any changes will be communicated via email or posted within the check-in system.
                        <br />
                        9. Contact Us
                        <br />
                        For questions or concerns about this Privacy Policy, please contact:
                        <br />
                        Pio Rivas
                        <br />
                        09177023640
                        <br />
                        pio.rivas@gmail.com
                        <br />
                        Thank you for trusting Kids Church Ministry with your child’s safety and privacy.
                    </p>
                </DynamicModal>
            )}
        </div>
    );
}