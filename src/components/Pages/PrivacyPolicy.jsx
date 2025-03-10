import React from "react";

export const PrivacyPolicy = () => {
    return (
        <div className="flex flex-col p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg">
                Kids Church Ministry Automated Check-In System Privacy Policy
            </p>
            <p className="text-lg font-semibold">
                Effective Date: January 01, 2025
            </p>
            <p className="text-lg font-semibold">
                1. Introduction
            </p>
            <p className="text-base">
                Welcome to the Kids Church Ministry Automated Check-In System. We value your trust and are committed to protecting the privacy of your family’s information. This Privacy Policy outlines how we collect, use, disclose, and safeguard the personal information provided during registration and check-in.
            </p>
            <p className="text-lg font-semibold">
                2. Information We Collect
            </p>
            <p className="text-base">
                We collect the following information during registration:
            </p>
            <ul className="list-disc list-inside text-base">
                <li>Parent/Guardian Full Name</li>
                <li>Contact Information</li>
                <li>Child’s Full Name, Date of Birth, and Gender</li>
                <li>Allergies, Medical Conditions, and Special Needs (if applicable)</li>
                <li>Emergency Contact Information</li>
            </ul>
            <p className="text-lg font-semibold">
                3. Purpose of Data Collection
            </p>
            <p className="text-base">
                The information collected is used exclusively for the following purposes:
            </p>
            <ul className="list-disc list-inside text-base">
                <li>Ensuring child safety and proper identification during check-in and check-out</li>
                <li>Providing emergency contact and medical assistance, if necessary</li>
                <li>Communicating updates, announcements, or emergencies related to the Kids Church Ministry</li>
            </ul>
            <p className="text-lg font-semibold">
                4. Data Sharing and Disclosure
            </p>
            <p className="text-base">
                We do not sell, trade, or share personal information with third parties, except:
            </p>
            <ul className="list-disc list-inside text-base">
                <li>With authorized church staff and volunteers for operational purposes</li>
                <li>In compliance with legal requirements or law enforcement requests</li>
                <li>In cases of emergency to protect the safety of children and families</li>
            </ul>
            <p className="text-lg font-semibold">
                5. Data Security
            </p>
            <p className="text-base">
                We implement appropriate technical and organizational measures to safeguard your data, including encryption, password protection, and access restrictions. However, no system is completely secure, and we encourage parents to notify us immediately of any suspected data breach.
            </p>
            <p className="text-lg font-semibold">
                6. Data Retention
            </p>
            <p className="text-base">
                We retain personal information only for as long as necessary to fulfill the purposes outlined in this policy. Data may be deleted upon request, except where retention is required by law or for safety purposes.
            </p>
            <p className="text-lg font-semibold">
                7. Parental Rights
            </p>
            <p className="text-base">
                Parents and guardians have the right to:
            </p>
            <ul className="list-disc list-inside text-base">
                <li>Access and review their data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of their data (subject to legal obligations)</li>
            </ul>
            <p className="text-lg font-semibold">
                8. Updates to This Policy
            </p>
            <p className="text-base">
                We may update this Privacy Policy periodically. Any changes will be communicated via email or posted within the check-in system.
            </p>
            <p className="text-lg font-semibold">
                9. Contact Us
            </p>
            <p className="text-base">
                If you have any questions or concerns about this Privacy Policy, please contact us at
                <a href="mailto:pio.rivas@gmail.com" className="text-cyan-600 hover:underline"> pio.rivas@gmail.com</a>
            </p>
            <p className="text-base">
                Thank you for trusting Kids Church Ministry with your child’s safety and privacy. We are committed to providing a secure and welcoming environment for all families.
            </p>
        </div>
    );
}