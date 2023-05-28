import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const API_TOKEN = "Your API Token";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
`;

const Description = styled.p`
  margin-bottom: 1rem;
`;

const GenForm = styled.form`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Loading = styled.div`
  margin-top: 1rem;
`;

const ResultImage = styled.div`
  margin-top: 1rem;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const Footer = styled.footer`
  margin-top: 1rem;
  font-size: 12px;
  color: #777;
`;

const ImageGenerationForm = () => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(null);
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setOutput(null); // Clear previous output
        setError(null); // Clear previous error
      
        const uniqueIdentifier = Date.now(); // Generate a unique identifier (timestamp)
      
        try {
          const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_TOKEN}`,
              },
              body: JSON.stringify({ inputs: `${inputValue}-${uniqueIdentifier}` }), // Append the unique identifier to the input value
            }
          );
      
          if (!response.ok) {
            throw new Error("Failed to generate image");
          }
      
          const blob = await response.blob();
          setOutput(URL.createObjectURL(blob));
          setLoading(false);
        } catch (error) {
          console.error("Failed to generate image:", error);
          setError("Failed to generate image. Please try again.");
          setLoading(false);
        }
      };
      
  
    useEffect(() => {
      return () => {
        if (output) {
          URL.revokeObjectURL(output);
        }
      };
    }, [output]);
  
    return (
        <Container>
          <Title>Stable Diffusion</Title>
          <Description>
            React Application utilizing the Huggingface API for Stable Diffusion Image Generation
          </Description>
          <GenForm onSubmit={handleSubmit}>
            <Input
              type="text"
              name="input"
              placeholder="Type your prompt here..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </GenForm>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {loading && <Loading>Loading...</Loading>} 
          {output && (
            <ResultImage>
              <Image src={output} alt="art" />
            </ResultImage>
          )}
          <Footer>Code Created by Peter Martens</Footer>
        </Container>
      );
    };
  
  export default ImageGenerationForm;